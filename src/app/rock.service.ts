import { Injectable, Component, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, NEVER, Subject } from 'rxjs';
import { catchError, retry, map, concatAll, pluck, tap, multicast } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    retreatInfo?: {
        retreatId: number
        gbs: string
        position: string
        attendAll: boolean
        dayTimeList: string[]
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
    static readonly firebaseAuthErrorCode = {
        'auth/invalid-email': '이메일을 잘못 입력했습니다. 올바른 이메일 주소를 입력하세요',
        'auth/user-not-found': '주어진 이메일에 해당하는 계정을 찾을 수 없습니다. 올바른 계정을 입력하세요',
        'auth/wrong-password': '비밀번호가 잘못되었습니다. 비밀번호는 적어도 6자여야 합니다',
    }

    static tuple = <T extends any[]>(...args: T): T => args;
    
    constructor(private _http: HttpClient, private _auth: AngularFireAuth, private _dialog: MatDialog, private _snackbar: MatSnackBar) {
        this.uid = _auth.authState.pipe(pluck('uid'));
    }

    static nonNull(object: any) {
        return object != null && object != undefined && Object.values(object)?.every(v => v != null && v != undefined);
    }

    login(id: string, password: string) {
        return this._auth.signInWithEmailAndPassword(id, password).catch(this.handleError);
    }

    sendEmail(email: string) { return this._auth.sendPasswordResetEmail(email).catch(this.handleError); }

    get loggedIn() { return this._auth.authState.pipe(map(user => user && !user.isAnonymous)); }

    logout() { return this._auth.signOut().catch(this.handleError); }

    editCampuses(id: number, campuses: string[]) {
        return this._http.put<Campuses>(`${this.root}/leaders/${id}/edit`, 
        {names: campuses}, { headers: this.headerBasic, observe: 'response' }
        ).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    editRetreat(resume: RetreatResume) {
        return this._http.post<RetreatResume>(`${this.root}/retreat/edit`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    private handleError<T>(error: any, caught?: Observable<T>) {
        if(error instanceof HttpErrorResponse){
            if (error.error instanceof ErrorEvent) {
                // 클라이언트나 네트워크 문제로 발생한 에러.
                console.error(`에러 발생: ${error.error.message}
                error: ${JSON.stringify(error)}`);
                window.alert(`에러 발생: ${error.error.message}
                error: ${JSON.stringify(error)}`);
            }
            else if(error.headers.get('Content-Type') == 'application/json') {
                if(error.error?.data) {
                    //backend-sent error
                    console.error(error.error.data);
                    window.alert(error.error.data);
                }
            }
            else if(error.headers.get('Content-Type') == 'text/html') {
                //backend-sent, html-shaped error
                const body = (error.error as string).split('<body')[1].substring(1);
                console.error(body);
                window.alert(body);
            }
        }
        else if(typeof error == "string") {
            //etc: string error
            console.error(error);
            window.alert(error);
        }
        else if(error?.code && error?.message) {
            //firebase-sent error
            console.error(`${error.code}\n${error.message}`);
            window.alert(`${RockService.firebaseAuthErrorCode[error.code]}`);
        }
        else if(!RockService.nonNull(error)) {
            //do nothing; keep silent
        }
        else {
            //unknown error
            console.error(`에러: ${JSON.stringify(error)}\n${typeof error}\n${error}`);
            window.alert(`에러: ${error}`);
        }
        return NEVER;
    }

    private static openErrorDialog(dialog: MatDialog, data: ErrorDialogData) {
        return dialog.open(ErrorDialog, { data });
    }

    get Leaders() {
        return this._http.get<Leaders>(`${this.root}/leaders`, { headers: this.headerBasic })
        .pipe(retry(3), catchError(this.handleError));
    }

    members(name: string) {
        return this._http.get<Member[]>(`${this.root}/members/search?name=${name}`, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }


    get MyInfo() {
        return this.uid.pipe(map((uid) => {
            return this._http.get<Info>(`${this.root}/members/info?uid=${uid}`, {
                headers: {
                    'Accept': 'application/json',
                    ...this.headerBasic
                }
            });
        }), concatAll(), retry(3), catchError(this.handleError));
    }

    registerMongsanpo(resume: MongsanpoResume) {
        return this._http.post<MongsanpoResume>(`${this.root}/mongsanpo/members`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    get MongsanpoMembers() {
        return this._http.get<MongsanpoMembers>(`${this.root}/mongsanpo/members`, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    registerRetreat(resume: RetreatResume) {
        return this._http.post<RetreatResume>(`${this.root}/retreat/register`, resume, {
        headers: this.headerBasic, observe: 'response',
        }).pipe(pluck('ok'), retry(3), catchError(this.handleError));
    }

    get retreatRegistered() {
        return this.MyInfo.pipe(map(info => RockService.nonNull(info.retreatInfo)));
    }

    setLeader(memId: number, grade: Grade = Grade.leader) {
        return this._http.post(`${this.root}/leaders/register`, `id=${memId}&grade=${grade}`, {
            headers: new HttpHeaders(this.headerBasic)
            .set('Content-type', 'application/x-www-form-urlencoded'),
            observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    signUp(resume: UserResume) {
        return this._http.post<UserResume>(`${this.root}/members/join`, resume, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    unsetLeader(id: number) {
        return this._http.delete(`${this.root}/leaders/${id}`, {
            headers: this.headerBasic, observe: 'response',
        }).pipe(retry(3), catchError(this.handleError), pluck('ok'));
    }

    openDefault(snackbar: MatSnackBar, message: string, action?: string, config?: MatSnackBarConfig) {
        return snackbar.open(message, action, { duration: 3000, horizontalPosition: 'start', ...config });
    }
}

interface ErrorDialogData {
    errorMessage: string
}

@Component({
    template: `
    <h1 mat-dialog-title>오류</h1>
    <mat-dialog-content>
        {{ data.errorMessage }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button mat-dialog-close cdkFocusInitial>확인</button>
    </mat-dialog-actions>
    `
  })
  export class ErrorDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorDialogData) {}
  }