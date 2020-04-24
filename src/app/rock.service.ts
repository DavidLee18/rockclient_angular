import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

enum Grade { member = "MEMBER", leader = "LEADER", admin = "ADMIN", mission = "MISSION" }

interface Campuses { names: string[] }

interface Info {
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

interface Leaders { data: Leader[] }

interface Member {
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

interface RetreatResume {
    memberUid: string
    lectureHope?: string
    originalGbs?: string
    retreatGbs: string
    position: string
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
    private info: Info;
    private readonly headerBasic = {
        'Authorization': 'Basic YWRtaW46ZGh3bHJybGVoISEh',
        'Content-Type': 'application/json'
    }
    constructor(private http: HttpClient) {
        this.MyInfo.subscribe((info) => this.info = info)
    }

    editCampuses(id: number, campuses: string[]) {
        return this.http.put<Campuses>(`${this.root}/leaders/${id}/edit`, 
        {names: campuses}, { headers: this.headerBasic })
        .pipe(retry(3), catchError(this.handleError));
    }

    editRetreat(resume: RetreatResume) {
        return this.http.post<RetreatResume>(`${this.root}/retreat/edit`, resume, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    private handleError<T>(error: HttpErrorResponse, caught?: Observable<T>) {
        if (error.error instanceof ErrorEvent) {
            // 클라이언트나 네트워크 문제로 발생한 에러.
            console.error('An error occurred:', error.error.message);
        } else {
            // 백엔드에서 실패한 것으로 보낸 에러.
            // 요청으로 받은 에러 객체를 확인하면 원인을 확인할 수 있습니다.
            console.error(`Backend returned code ${error.status}. 
            body was: ${error.error}`);
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
        return this.http.get<Info>(`${this.root}/members/info?uid=`, {
            headers: {
                'Accept': 'application/json',
                ...this.headerBasic
            }
        }).pipe(retry(3), catchError(this.handleError));
    }

    registerMongsanpo(resume: MongsanpoResume) {
        return this.http.post<MongsanpoResume>(`${this.root}/mongsanpo/members`, resume, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    registerRetreat(resume: RetreatResume) {
        return this.http.post<RetreatResume>(`${this.root}/retreat/register`, resume, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    setLeader({ memId, grade = Grade.leader }: { memId: number; grade: Grade; }) {
        return this.http.post(`${this.root}/leaders/register`, `id=${memId}&grade=${grade}`, {
            headers: new HttpHeaders(this.headerBasic)
            .set('Content-type', 'application/x-www-form-urlencoded')
        })
        .pipe(retry(3), catchError(this.handleError));
    }

    signUp(resume: UserResume) {
        return this.http.post<UserResume>(`${this.root}/members/join`, resume, {
            headers: this.headerBasic
        }).pipe(retry(3), catchError(this.handleError));
    }

    unsetLeader(id: number) {
        return this.http.delete(`${this.root}/leaders/${id}`, { headers: this.headerBasic })
        .pipe(retry(3), catchError(this.handleError));
    }
}