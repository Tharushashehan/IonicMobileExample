
export class ScoreCardModel {
    activities: {
        work_time: {
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
        };
        driving: {
          summary: {
            DrivingDistance: number;
            DrivingTime: number;
          };
          driving_safety: {
            BrakeCount: number;
            HardCornersCount: number;
            SwervesCount: number;
            HardAccelerationCount: number;
            AggressiveEventsCount: number;
            DrivingSpeed: number;
          };
        };
        bending: {
          bending: {
            TotalBendingCount: number;
            TotalBendingTime: number;
          };
          bending_times: {
            BendTime21To30: number;
            BendTime31To40: number;
            BendTime41To50: number;
            BendTime51To60: number;
            BendTime61To70: number;
            BendTime70: number;
          };
          bending_counts: {
            BendCount21To30: number;
            BendCount31To40: number;
            BendCount41To50: number;
            BendCount51To60: number;
            BendCount61To70: number;
            BendCount70: number;
            BendCount21_30NoAccel: number;
            BendCount31_40NoAccel: number;
            BendCount41_50NoAccel: number;
            BendCount51_60NoAccel: number;
            BendCount61_70NoAccel: number;
            BendCount70NoAccel: number;
            BendCount21_30Accel: number;
            BendCount31_40Accel: number;
            BendCount41_50Accel: number;
            BendCount51_60Accel: number;
            BendCount61_70Accel: number;
            BendCount70Accel: number;
            BendCount21_30Twist: number;
            BendCount31_40Twist: number;
            BendCount41_50Twist: number;
            BendCount51_60Twist: number;
            BendCount61_70Twist: number;
            BendCount70Twist: number;
            BendCount21_30TwistAccel: number;
            BendCount31_40TwistAccel: number;
            BendCount41_50TwistAccel: number;
            BendCount51_60TwistAccel: number;
            BendCount61_70TwistAccel: number;
            BendCount70TwistAccel: number;
          };
        };
        squatting: {
          summary: {
            SquattingTime: number;
            SquattingCount: number;
          };
        };
        twisting: {
          summary: {
            TotalTwistingTime: number;
            TotalTwistingCount: number;
          };
          twisting_degrees: {
            TwistBelow45Count: number;
            TwistBelow45WithAccelerationCount: number;
            TwistAbove45Count: number;
            TwistAbove45WithAccelerationCount: number;
          };
        };
        indoor_driving: {
          summary: {
            IndoorDrivingTime: number;
            IndoorDrivingSafety: number;
            IndoorDrivingHardBrakes: number;
            IndoorDrivingHardManeuvers: number;
          };
        };
        lumbar_score: {
          summary: {
            DynamicScore: number;
            StaticScore: number;
          };
        };
      };
      units: {
        work_time: {
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
        };
        bending: {
          bending: {
            TotalBendingCount: string;
            TotalBendingTime: string;
          };
          bending_times: {
            BendTime21To30: string;
            BendTime31To40: string;
            BendTime41To50: string;
            BendTime51To60: string;
            BendTime61To70: string;
            BendTime70: string;
          };
          bending_counts: {
            BendCount21To30: string;
            BendCount31To40: string;
            BendCount41To50: string;
            BendCount51To60: string;
            BendCount61To70: string;
            BendCount70: string;
            BendCount21_30NoAccel: string;
            BendCount31_40NoAccel: string;
            BendCount41_50NoAccel: string;
            BendCount51_60NoAccel: string;
            BendCount61_70NoAccel: string;
            BendCount70NoAccel: string;
            BendCount21_30Accel: string;
            BendCount31_40Accel: string;
            BendCount41_50Accel: string;
            BendCount51_60Accel: string;
            BendCount61_70Accel: string;
            BendCount70Accel: string;
            BendCount21_30Twist: string;
            BendCount31_40Twist: string;
            BendCount41_50Twist: string;
            BendCount51_60Twist: string;
            BendCount61_70Twist: string;
            BendCount70Twist: string;
            BendCount21_30TwistAccel: string;
            BendCount31_40TwistAccel: string;
            BendCount41_50TwistAccel: string;
            BendCount51_60TwistAccel: string;
            BendCount61_70TwistAccel: string;
            BendCount70TwistAccel: string;
          };
        };
        squatting: {
          summary: {
            SquattingTime: string;
            SquattingCount: string;
          };
        };
        twisting: {
          summary: {
            TotalTwistingTime: string;
            TotalTwistingCount: string;
          };
          twisting_degrees: {
            TwistBelow45Count: string;
            TwistBelow45WithAccelerationCount: string;
            TwistAbove45Count: string;
            TwistAbove45WithAccelerationCount: string;
          };
        };
        indoor_driving: {
          summary: {
            IndoorDrivingTime: string;
            IndoorDrivingSafety: string;
            IndoorDrivingHardBrakes: string;
            IndoorDrivingHardManeuvers: string;
          };
        };
        lumbar_score: {
          summary: {
            DynamicScore: string;
            StaticScore: string;
          };
        };
      };
}