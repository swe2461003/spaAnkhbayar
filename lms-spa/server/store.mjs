import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
export const roles = ['student','teacher','manager','office','admin'];
export const roleNames = { student:'Сурагч',teacher:'Багш',manager:'Менежер',office:'Сургалтын алба',admin:'Админ' };
export const now = () => new Date().toISOString();
export const id = () => randomBytes(16).toString('hex');
export const hash = value => createHash('sha256').update(value).digest('hex');
export function fail(message,status=400){throw Object.assign(new Error(message),{status});}
export function passwordHash(value){if(typeof value!=='string'||value.length<12||value.length>200)fail('Нууц үг 12–200 тэмдэгт байна.');const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(value,salt,64).toString('hex');}
export function passwordMatches(value,stored){if(typeof value!=='string'||value.length>200)return false;const [salt,digest]=stored.split(':');return timingSafeEqual(scryptSync(value,salt,64),Buffer.from(digest,'hex'));}
export function openStore(file){mkdirSync(dirname(file),{recursive:true});const db=new DatabaseSync(file);db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,password TEXT NOT NULL,courses TEXT NOT NULL DEFAULT '[]',student_id TEXT NOT NULL DEFAULT '',active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,data TEXT NOT NULL,version INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,time TEXT NOT NULL,user_id TEXT NOT NULL,user_name TEXT NOT NULL,action TEXT NOT NULL,entity TEXT NOT NULL,before_json TEXT,after_json TEXT);
CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT,'Audit is append only'); END;
CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT,'Audit is append only'); END;
CREATE TABLE IF NOT EXISTS archives(id TEXT PRIMARY KEY,name TEXT NOT NULL,semester TEXT NOT NULL,category TEXT NOT NULL,roles TEXT NOT NULL,mime TEXT NOT NULL,content BLOB NOT NULL,created TEXT NOT NULL,owner TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sync_base(id TEXT PRIMARY KEY,data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS conflicts(id TEXT PRIMARY KEY,local_json TEXT NOT NULL,remote_json TEXT NOT NULL,time TEXT NOT NULL);
`);return db;}
export function publicUser(u){return u&&{id:u.id,email:u.email,name:u.name,role:u.role,courses:JSON.parse(u.courses),studentId:u.student_id,active:!!u.active};}
export function requireRole(user,allowed){if(!user)fail('Нэвтэрнэ үү.',401);if(!allowed.includes(user.role))fail('Энэ үйлдлийг хийх эрхгүй.',403);}
export function canSee(user,row){return ['admin','manager','office'].includes(user.role)||(user.role==='teacher'&&user.courses.includes(row.course))||(user.role==='student'&&!!user.studentId&&user.studentId===row.studentId);}
export function canEdit(user,row){return ['admin','office'].includes(user.role)||(user.role==='teacher'&&user.courses.includes(row.course));}
export function cleanRecord(input){const r={};for(const key of ['studentId','studentName','course','teacher','semester']){if(typeof input[key]!=='string'||!input[key].trim()||input[key].length>120)fail('Дутуу эсвэл буруу талбар: '+key);r[key]=input[key].trim();}if(typeof input.score!=='number'||!Number.isFinite(input.score)||input.score<0||input.score>100)fail('Оноо 0–100 байна.');if(typeof input.credits!=='number'||!Number.isFinite(input.credits)||input.credits<=0||input.credits>30)fail('Кредит 0-ээс их, 30-аас бага буюу тэнцүү байна.');r.score=input.score;r.credits=input.credits;return r;}
export function audit(db,user,action,entity,before=null,after=null){db.prepare('INSERT INTO audit(time,user_id,user_name,action,entity,before_json,after_json) VALUES(?,?,?,?,?,?,?)').run(now(),user?.id||'system',user?.name||'Excel sync',action,entity,before===null?null:JSON.stringify(before),after===null?null:JSON.stringify(after));}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const value=fn();db.exec('COMMIT');return value;}catch(e){db.exec('ROLLBACK');throw e;}}
export function records(db){return db.prepare('SELECT * FROM records').all().map(r=>({...JSON.parse(r.data),id:r.id,version:r.version}));}
export function saveRecord(db,user,input,recordId,expected){return transaction(db,()=>{const old=db.prepare('SELECT * FROM records WHERE id=?').get(recordId);const previous=old?{...JSON.parse(old.data),id:recordId,version:old.version}:null;const data=cleanRecord(input);if(!canEdit(user,data)||(previous&&!canEdit(user,previous)))fail('Энэ хичээлийн дүнг өөрчлөх эрхгүй.',403);if(old&&old.version!==expected)fail('Өөр хэрэглэгч энэ мөрийг өөрчилсөн. Шинэчлээд дахин оруулна уу.',409);if(!old&&expected!==0)fail('Мөр олдсонгүй.',404);const row={...data,id:recordId,updatedAt:now()};db.prepare('INSERT INTO records(id,data,version) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,version=excluded.version').run(recordId,JSON.stringify(row),(old?.version||0)+1);audit(db,user,old?'record.update':'record.create',recordId,previous,row);return {...row,version:(old?.version||0)+1};});}
export function reportRows(rows){const groups=new Map();for(const r of rows){const key=r.semester+'\0'+r.course;let g=groups.get(key);if(!g){g={semester:r.semester,course:r.course,count:0,total:0,passed:0};groups.set(key,g);}g.count++;g.total+=r.score;if(r.score>=60)g.passed++;}return [...groups.values()].map(g=>({...g,average:+(g.total/g.count).toFixed(2),passRate:+(g.passed*100/g.count).toFixed(2)}));}
