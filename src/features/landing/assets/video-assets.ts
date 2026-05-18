export interface LandingVideoAsset {
  readonly desktop: string;
  readonly mobile: string;
}

export const landingVideoAssets = {
  hero: {
    desktop:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086237/video1v2_sbglcy.mp4",
    mobile:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086237/video2-mobile_o8pqut.mp4",
  },
  whyWemWorks: {
    desktop:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086238/video2v2_m6wjhr.mp4",
    mobile:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086237/video2-mobile_o8pqut.mp4",
  },
  systemFlow: {
    desktop:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086239/video3v2_rn119q.mp4",
    mobile:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086239/video3-mobile_yr8gns.mp4",
  },
  howItWorks: {
    desktop:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086239/video4v2_pnkubg.mp4",
    mobile:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086239/video4-mobile_bdnihw.mp4",
  },
  portfolioResults: {
    desktop:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086238/video5v2_kjyyu2.mp4",
    mobile:
      "https://res.cloudinary.com/dhdkedt1m/video/upload/v1779086237/video5-mobile_tslgm5.mp4",
  },
} satisfies Record<string, LandingVideoAsset>;
