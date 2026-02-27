export interface BehaviorRecord {
    id: number;
    description: string;
    points: number;
    createdAt: string;
}

export interface Student {
    id: number;
    name: string;
    avatarUrl: string;
    totalPoints: number;
    behaviorRecords: BehaviorRecord[];
}

export interface Classroom {
    id: number;
    name: string;
}
