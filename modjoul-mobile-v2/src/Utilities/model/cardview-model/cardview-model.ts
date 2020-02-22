export class CardViewModel{
    walking : {
        TotalWalkingSteps:number;
        TotalWalkingTime:number;
    };
    bending : {
        TotalBendingCount:number;
        TotalBendingTime:number;
    };
    twisting : {
        TotalTwistingCount:number;
        TotalTwistingTime:number;
    };
    stationary_work : {
        StationaryWorkTimePercentage:number;
        StationaryWorkTime:number;
    };
    indoor_driving : {
        IndoorDrivingSafety:number;
        IndoorDrivingTime:number;
    };
    driving : {
        DrivingDistance:number;
        DrivingTime:number;
    };
    sitting_standing : {
        SittingStandingTimePercentage:number;
        SittingStandingTime:number;
    };
    laying : {
        LayingTimePercentage:number;
        LayingTime:number;
    };
}