
export class WorkTimeModel{

    activities :{
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
    units : {

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
}