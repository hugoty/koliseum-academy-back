export enum Role {
    Student = 'student',
    Coach = 'coach',
    Admin = 'admin'
}

export enum RequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Canceled = 'canceled'
}

export enum Level {
    Beginner = 'beginner',
    Advanced = 'advanced',
    Veteran = 'veteran',
    Expert = 'expert'
}

export interface SearchData {
    coachName?: string,
    coachIds?: number[],
    sports?: number[],
    minDate?: Date,
    maxDate?: Date,
    locations?: string[],
    minPlaces?: number,
    maxPlaces?: number,
    minRemainingPlaces?: number,
    maxRemainingPlaces?: number
}