export class UnifiedMeet {
    id: number
    title: string
    description: string
    dateBegin: Date
    dateEnding: Date
    isRecurring: boolean
    recurrence: string
    source: 'local' | 'google';
    MemberId?: number[];
    linkOrLocalisation?: string;
}