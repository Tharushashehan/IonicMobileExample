
export class WorkTimeModelUnit{



    walking: {
        TotalWalkingSteps: string;
        TotalWalkingDistance: string;
        TotalWalkingTime: string;
        WalkingTimePercentage: string;
        WalkingSpeed: string;
      };
      bending: {
        TotalBendingTime: string;
        TotalBendingCount: string;
      };
      twisting: {
        TotalTwistingTime: string;
        TotalTwistingCount: string;
      };
      squatting: {
        TotalSquattingCount: string;
      };
      others: {
        TotalOthersTime: string;
      };
      indoor_driving: {
        IndoorDrivingTime: string;
        IndoorDrivingSafety: string;
      };
      driving: {
        DrivingDistance: string;
        DrivingTime: string;
        BrakeCount: string;
        HardCornersCount: string;
        SwervesCount: string;
        HardAccelerationCount: string;
        AggressiveEventsCount: string;
        DrivingSpeed: string;
      };
      sitting_standing: {
        SittingStandingTime: string;
        SittingStandingTimePercentage: string;
      };
      stationary_work: {
        StationaryWorkTime: string;
        StationaryWorkTimePercentage: string;
      };
      laying: {
        TotalIdleTime: string;
        LayingTime: string;
        LayingTimePercentage: string;
      };
      lumbar_score: {
        DynamicScore: string;
        StaticScore: string;
      };
      summary: {
        TotalWorkTime: string;
        WorkTime: string;
        WorkTimePercentage: string;
      };
}
