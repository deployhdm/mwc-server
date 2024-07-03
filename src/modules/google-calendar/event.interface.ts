export interface Event {
    id?: string
    status?: string
    summary?: string
    description?: string
    start?: {
        date?: string
        dateTime?: string
        timeZone?: string
    }
    end?: {
        date?: string,
        dateTime?: string
        timeZone?: string
    }
    recurrence?: string[]

}