export interface LandingVideoAsset {
  readonly desktop: string;
  readonly mobile: string;
}

export const landingVideoAssets = {
  hero: {
    desktop:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653602/video1v2_df9r9a.mp4",
    mobile:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778843661/video1-mobile_goha9m.mp4",
  },
  whyWemWorks: {
    desktop:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653613/video2v2_gi85w7.mp4",
    mobile:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778843658/video2-mobile_fynlwn.mp4",
  },
  systemFlow: {
    desktop:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653612/video3v2_hmj8er.mp4",
    mobile:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778843658/video3-mobile_m1h6sk.mp4",
  },
  howItWorks: {
    desktop:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653607/video4v2_qtbu47.mp4",
    mobile:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778843658/video4-mobile_nn4twb.mp4",
  },
  portfolioResults: {
    desktop:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653606/video5v2_nybafe.mp4",
    mobile:
      "https://res.cloudinary.com/dcderdzpp/video/upload/v1778843658/video5-mobile_jb17wy.mp4",
  },
} satisfies Record<string, LandingVideoAsset>;
