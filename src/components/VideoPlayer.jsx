import React from 'react';

const VideoPlayer = ({ embedUrl, videoUrl }) => {
  // إذا كان هناك رابط تضمين، استخدمه أولاً
  if (embedUrl) {
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item"
          src={embedUrl}
          title="Embedded video"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  // إذا كان هناك رابط فيديو مرفوع، استخدمه
  if (videoUrl) {
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <video 
          className="embed-responsive-item" 
          controls 
          style={{ width: '100%', height: 'auto' }}
        >
          <source src={videoUrl} type="video/mp4" />
          متصفحك لا يدعم عرض الفيديو.
        </video>
      </div>
    );
  }
  
  // إذا لم يكن هناك أي رابط
  return <div className="alert alert-warning">لا يوجد فيديو متاح</div>;
};

export default VideoPlayer;