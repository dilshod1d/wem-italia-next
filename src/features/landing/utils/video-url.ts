const CLOUDINARY_UPLOAD_SEGMENT = "/video/upload/";
const MOBILE_VIDEO_TRANSFORM =
  "/video/upload/f_mp4,vc_h264,ac_none,q_auto:good,w_760,c_scale,ki_1/";
// const MOBILE_VIDEO_TRANSFORM =
//   "/video/upload/f_mp4,vc_h264,ac_none,q_auto:eco,w_760,c_scale,ki_0.033/";

export function getMobileOptimizedVideoUrl(videoUrl: string) {
  return videoUrl.replace(CLOUDINARY_UPLOAD_SEGMENT, MOBILE_VIDEO_TRANSFORM);
}
