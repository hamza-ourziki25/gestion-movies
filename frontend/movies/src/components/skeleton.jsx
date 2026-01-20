import React from 'react';
import './skeleton.css';

export default function ProfileSkeleton() {
  return (
    <div style={{width: '100%', minHeight: '100vh', background: '#0f0f0f'}}>
      
      {/* 1. Banner */}
      <div className="skeleton sk-banner"></div>

      {/* 2. Header (Avatar + Name + Stats) */}
      <div className="sk-header">
        <div className="sk-info-group">
          <div className="skeleton sk-avatar"></div>
          <div style={{marginBottom: '10px'}}>
            <div className="skeleton sk-title"></div>
            <div className="skeleton sk-text" style={{width: '100px'}}></div>
          </div>
        </div>
        
        <div style={{display:'flex', gap:'30px', paddingBottom:'10px'}}>
           <div className="skeleton sk-stat"></div>
           <div className="skeleton sk-stat"></div>
           <div className="skeleton sk-stat"></div>
        </div>
      </div>

      {/* 3. Tabs */}
      <div className="skeleton sk-tabs"></div>

      {/* 4. Grid Layout */}
      <div className="sk-grid">
        
        {/* Left Column (Bio) */}
        <div>
           <div className="skeleton sk-text" style={{width: '50%', marginBottom:'20px'}}></div>
           <div className="skeleton sk-text"></div>
           <div className="skeleton sk-text"></div>
           <div className="skeleton sk-text" style={{width: '80%'}}></div>
           
           <div className="skeleton sk-text" style={{width: '60%', marginTop:'40px', marginBottom:'20px'}}></div>
           <div className="skeleton" style={{height:'100px', width:'100%'}}></div>
        </div>

        {/* Right Column (Cards) */}
        <div>
           <div className="skeleton sk-text" style={{width: '30%', marginBottom:'20px'}}></div>
           <div style={{display:'flex', gap:'15px', overflow:'hidden'}}>
              {[1,2,3,4,5].map(i => (
                  <div key={i} className="skeleton sk-card" style={{minWidth:'140px'}}></div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}