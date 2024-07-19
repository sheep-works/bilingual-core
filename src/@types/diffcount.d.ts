declare interface WWCInfo extends WWCRate {
    name: string;
    sum: number;
    sum2: number;
}

declare interface WWCReport extends WWCInfo {
    base: WWCRate;
    files: WWCInfo[];
}

declare interface DiffSeg {
    pid: number;
    gid: number;
    fid: number;
    st: string;
    tt: string;
    len: number;
    sims: SimilarSegment[];
    max: number;
    maxp: number;
}

declare interface SimilarSegment {
    advPid: number;
    st2: string;
    ratio: number;
    opcode: Opcode[];
}

declare type Calcresult = {
    sims: SimilarSegment[];
    max: number;
    maxp: number;
};