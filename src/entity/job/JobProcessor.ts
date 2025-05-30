import {Job} from "./Job";
import {오정노인복지기관} from "./implement/gyeonggi/bucheon/부천시노인복지기관포털/오정노인복지관";
import {원미노인복지관} from "./implement/gyeonggi/bucheon/부천시노인복지기관포털/원미노인복지관";
import {소사노인복지관} from "./implement/gyeonggi/bucheon/부천시노인복지기관포털/소사노인복지관";
import {부천시니어클럽} from "./implement/gyeonggi/bucheon/부천시노인복지기관포털/부천시니어클럽";
import {소사본종합사회복지관} from "./implement/gyeonggi/bucheon/부천종합사회복지관포털/소사본종합사회복지관";
import {상동종합사회복지관} from "./implement/gyeonggi/bucheon/부천종합사회복지관포털/상동종합사회복지관";
import {대산종합사회복지관} from "./implement/gyeonggi/bucheon/부천종합사회복지관포털/대산종합사회복지관";
import {춘의종합사회복지관} from "./implement/gyeonggi/bucheon/부천종합사회복지관포털/춘의종합사회복지관";
import {심곡동종합사회복지관} from "./implement/gyeonggi/bucheon/부천종합사회복지관포털/심곡동종합사회복지관";
import {인천종합사회복지관} from "./implement/incheon/인천종합사회복지관";
import {인천광역시장애인종합복지관} from "./implement/incheon/인천광역시장애인종합복지관";
import {미추홀장애인종합복지관} from "./implement/incheon/미추홀장애인종합복지관";
import {서울시사회복지사협회} from "./implement/seoul/서울시사회복지사협회";
import {인천광역시사회복지사협회} from "./implement/incheon/인천광역시사회복지사협회";
import {경기도사회복지사협회} from "./implement/gyeonggi/경기도사회복지사협회";
import {한국노인인력개발원} from "./implement/한국노인인력개발원";
import {대한의료사회복지사협회} from "./implement/대한의료사회복지사협회";
import {SyncManager} from "../component/SyncManager";
import {FileManager} from "../component/FileManager";
import {Page} from "@playwright/test";


export class JobProcessor {
    jobs: Job[] = [
        new 대한의료사회복지사협회(),
        new 한국노인인력개발원(),
        new 경기도사회복지사협회(),
        // new 오정노인복지기관(), new 원미노인복지관(), new 소사노인복지관(), new 부천시니어클럽(),
        // new 소사본종합사회복지관(), new 상동종합사회복지관(), new 대산종합사회복지관(), new 춘의종합사회복지관(), new 심곡동종합사회복지관(),
        // new 인천종합사회복지관(),
        // new 인천광역시장애인종합복지관(),
        // new 인천광역시사회복지사협회(),
        // new 미추홀장애인종합복지관(),
        // new 서울시사회복지사협회(),
    ];
    results: Record<string, any> = {};
    syncDates : Record<string, string> = {};
    completedSyncDates : Array<string>= [];


    async sync() {
        await SyncManager.fetchSync();
    }
    loadFetchSync() {
        const json = SyncManager.loadFetchSync();
        this.syncDates = json['sync'];
        console.log('sync : ', this.syncDates);
    }

    syncComplete() {
        this.results['complete'] = this.completedSyncDates;
        console.log('result : ', this.results);
    }

    // Symbol.iterator 구현
    *[Symbol.iterator]() {
        for (const job of this.jobs) {
            yield job;
        }
    }

    async runner(page: Page, job: Job) {
        const syncDate = SyncManager.parseDate(this.syncDates[job.jobName]);
        const result = await job.run(page, syncDate);
        this.completedSyncDates.push(job.jobName);
        this.results['data'] = {...this.results['data'], ...result};
    }
}