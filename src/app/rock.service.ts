import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, concatAll, pluck, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

enum Grade { member = "MEMBER", leader = "LEADER", admin = "ADMIN", mission = "MISSION" }

type Campuses = { names: string[] }

export interface Info {
    memId: number
    name: string
    campus: string
    dt_birth: string
    mobile: string
    uid: string
    grade: Grade
    retreatGbsInfo?: {
        retreatId: number
        gbs: string
        position: string
    }
    gbsInfo?: {
        gbs: string
        position: string
    }
}

interface Leader {
    id: number
    name: string
    mobile: string
    memberId: number
    campuses: string[]
}

type Leaders = { data: Leader[] }

export interface Member {
    id: number
    name: string
    mobile: string
    dt_birth: string
    campus: string
    active: boolean
}

interface MongsanpoResume {
    name: string
    mobile: string
    belongTo: string
    carNumber: string
}

type MongsanpoMembers = { data: MongsanpoResume[] }

export interface RetreatResume {
    memberUid: string
    lectureHope?: string
    originalGbs?: string
    retreatGbs: string
    position: string
    attendType?: string
    attendAll?: boolean
    dayTimeList?: string[]
}

interface UserResume {
    email: string
    password: string
    name: string
    mobile: string
    birthDate: string
    sex: string
    campus: string
    address: string
    school: string
    major: string
    grade: string
    guide?: string
}

@Injectable({ providedIn: "root" })
export class RockService {
    private readonly root = 'http://cba.sungrak.or.kr:9000';
    private uid: Observable<string>;
    private readonly headerBasic = {
        'Authorization': 'Basic YWRtaW46ZGh3bHJybGVoISEh',
        'Content-Type': 'application/json'
    }
    
    constructor(private http: HttpClient, private auth: AngularFireAuth) {
        this.uid = auth.authState.pipe(pluck('uid'));
    }

    static nonNull(object: any) {
        return Object.values(object).every(v => v);
    }

    login(id: string, password: string) {
        return this.auth.signInWithEmailAndPassword(id, password).catch(this.handleError);
    }

    sendEmail(email: string) { return this.auth.sendPasswordResetEmail(email).catch(this.handleError); }

    get loggedIn() { return this.auth.authState.pipe(map(user => user && !user.isAnonymous)); }

    logout() { return this.auth.signOut().catch(this.handleError); }

    editCampuses(id: number, campuses: string[]) {
        return this.http.put<Campuses>(`${this.root}/leaders/${id}/edit`, 
        {names: campuses}, { headers: this.headerBasic, observe: 'response' }
        ).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    editRetreat(resume: RetreatResume) {
        return this.http.post<RetreatResume>(`${this.root}/retreat/edit`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    private handleError<T>(error: HttpErrorResponse, caught?: Observable<T>) {
        if (error.error instanceof ErrorEvent) {
            // 클라이언트나 네트워크 문제로 발생한 에러.
            console.error('에러 발생:', error.error.message);
        } else {
            // 백엔드에서 실패한 것으로 보낸 에러.
            // 요청으로 받은 에러 객체를 확인하면 원인을 확인할 수 있습니다.
            console.error(`벡엔드 code: ${error.status}(${error.statusText}). 
            body: ${JSON.stringify(error.error)} (${error.message})`);
        }
        // 사용자가 이해할 수 있는 에러 메시지를 반환합니다.
        return throwError('Something bad happened; please try again later.');
    }

    get Leaders() {
        return this.http.get<Leaders>(`${this.root}/leaders`, { headers: this.headerBasic })
        .pipe(retry(3), catchError(this.handleError));
    }

    members(name: string) {
        return this.http.get<Member[]>(`${this.root}/members/search?name=${name}`, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }


    get MyInfo() {
        return this.uid.pipe(map((uid) => {
            if(uid == null) throw new Error("uid null!");
            else return this.http.get<Info>(`${this.root}/members/info?uid=${uid}`, {
                headers: {
                    'Accept': 'application/json',
                    ...this.headerBasic
                }
            });
        }), concatAll(), retry(3), catchError(this.handleError));
    }

    registerMongsanpo(resume: MongsanpoResume) {
        return this.http.post<MongsanpoResume>(`${this.root}/mongsanpo/members`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    get MongsanpoMembers() {
        return this.http.get<MongsanpoMembers>(`${this.root}/mongsanpo/members`, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    registerRetreat(resume: RetreatResume) {
        return of(resume).pipe(map(resume => {
            if(resume.attendAll != null
                && resume.attendAll != undefined
                && resume.originalGbs
                && (resume.attendAll && (resume.dayTimeList == null || resume.dayTimeList == undefined || resume.dayTimeList?.length == 0)) || (!resume.attendAll && resume.dayTimeList.length > 0))
                return this.http.post<RetreatResume>(`${this.root}/retreat/register`, resume, {
                headers: this.headerBasic, observe: 'response',
            }); else return throwError("수련회 등록에 필수값 없음");
        }), concatAll(), pluck('ok'), retry(3), catchError(this.handleError));
    }

    get retreatRegistered() {
        return this.MyInfo.pipe(map(info => RockService.nonNull(info.retreatGbsInfo)));
    }

    setLeader(memId: number, grade: Grade = Grade.leader) {
        return this.http.post(`${this.root}/leaders/register`, `id=${memId}&grade=${grade}`, {
            headers: new HttpHeaders(this.headerBasic)
            .set('Content-type', 'application/x-www-form-urlencoded'),
            observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    signUp(resume: UserResume) {
        return this.http.post<UserResume>(`${this.root}/members/join`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    unsetLeader(id: number) {
        return this.http.delete(`${this.root}/leaders/${id}`, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    openDefault(snackbar: MatSnackBar, message: string, action?: string, config?: MatSnackBarConfig) {
        return snackbar.open(message, action, { duration: 3000, horizontalPosition: 'start', ...config });
    }
}