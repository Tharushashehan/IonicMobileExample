
export class WorkTimeModelData{

    walking: {
        TotalWalkingSteps:number;
        TotalWalkingDistance: number;
        TotalWalkingTime: number;
        WalkingTimePercentage: number;
        WalkingSpeed: number;
      };
      bending: {
        TotalBendingTime: number;
        TotalBendingCount: number;
      };
      twisting: {
        TotalTwistingTime: number;
        TotalTwistingCount: number;
      };
      squatting: {
        TotalSquattingCount: number;
      };
      others: {
        TotalOthersTime:number;
      };
      indoor_driving: {
        IndoorDrivingTime: number;
        IndoorDrivingSafety: number;
      };
      driving: {
        DrivingDistance: number;
        DrivingTime: number;
        BrakeCount: number;
        HardCornersCount: number;
        SwervesCount: number;
        HardAccelerationCount: number;
        AggressiveEventsCount: number;
        DrivingSpeed: number;
      };
      sitting_standing: {
        SittingStandingTime: number;
        SittingStandingTimePercentage: number;
      };
      stationary_work: {
        StationaryWorkTime: number;
        StationaryWorkTimePercentage: number;
      };
      laying: {
        TotalIdleTime: number;
        LayingTime: number;
        LayingTimePercentage: number;
      };
      lumbar_score: {
        DynamicScore: number;
        StaticScore: number;
      };
      summary: {
        TotalWorkTime: number;
        WorkTime: number; 
        WorkTimePercentage: number;
      };
}