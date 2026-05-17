"use client";

import React from 'react';
import { useLeagueConnect } from '@/hooks/useLeagueConnect'; 

const LcuInfo = () => {
  const { isLCUConnected, lcuData } = useLeagueConnect();

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', color: '#2d3748', fontSize: '28px', fontWeight: '700' }}>Hệ thống LCU Dashboard</h1>
      
      {/* Badge Trạng thái */}
      <div style={{
        padding: '12px 20px',
        borderRadius: '50px',
        backgroundColor: isLCUConnected ? '#e6fffa' : '#fff5f5',
        color: isLCUConnected ? '#2c7a7b' : '#c53030',
        border: `1px solid ${isLCUConnected ? '#81e6d9' : '#feb2b2'}`,
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <span style={{ 
          height: '10px', 
          width: '10px', 
          backgroundColor: isLCUConnected ? '#38a169' : '#e53e3e', 
          borderRadius: '50%', 
          marginRight: '10px',
          display: 'inline-block'
        }}></span>
        {isLCUConnected ? 'LCU: ĐANG KẾT NỐI (HTTPS)' : 'LCU: MẤT KẾT NỐI (Vui lòng mở Client LMHT)'}
      </div>

      {/* THÔNG TIN TRẬN ĐẤU REAL-TIME (Tự động xuất hiện nếu đang chơi) */}
      {isLCUConnected && lcuData && lcuData.currentGame && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          backgroundColor: '#ebf8ff',
          border: '1px solid #90cdf4',
          borderRadius: '12px',
          maxWidth: '900px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2b6cb0', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center' }}>
            🎮 TRẬN ĐẤU ĐANG DIỄN RA (LIVE)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '11px', fontWeight: '700' }}>MATCH ID (GAME ID)</label>
              <span style={{ fontSize: '20px', color: '#2c5282', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {lcuData.currentGame.gameId}
              </span>
            </div>
            <div>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '11px', fontWeight: '700' }}>CHẾ ĐỘ CHƠI</label>
              <span style={{ fontSize: '16px', color: '#2d3748', fontWeight: '600' }}>
                {lcuData.currentGame.mapDescription} ({lcuData.currentGame.gameMode})
              </span>
            </div>
            <div>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '11px', fontWeight: '700' }}>TRẠNG THÁI</label>
              <span style={{ 
                fontSize: '13px', 
                backgroundColor: '#319795', 
                color: '#fff', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {lcuData.currentGame.phase}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Thông tin chi tiết Credentials */}
      {isLCUConnected && lcuData && (
        <div style={{ 
          marginTop: '25px', 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          maxWidth: '900px',
          border: '1px solid #edf2f7'
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #edf2f7', paddingBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '5px' }}>CỔNG KẾT NỐI (PORT)</label>
              <span style={{ fontSize: '22px', color: '#2d3748', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {lcuData.port}
              </span>
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '5px' }}>MÃ TIẾN TRÌNH (PID)</label>
              <span style={{ fontSize: '22px', color: '#4a5568', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {lcuData.pid || 'N/A'}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '5px' }}>MẬT KHẨU RIOT (PASSWORD)</label>
              <span style={{ fontSize: '18px', color: '#dd6b20', fontWeight: 'bold', fontFamily: 'monospace', backgroundColor: '#fffaf0', padding: '2px 6px', borderRadius: '4px', border: '1px dashed #fbd38d' }}>
                {lcuData.password}
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#a0aec0', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '5px' }}>RIÔT GAMES SSL CERTIFICATE</label>
            <div style={{ 
              marginTop: '8px', padding: '12px', backgroundColor: '#1a202c', color: '#f7fafc', borderRadius: '8px',
              wordBreak: 'break-all', fontSize: '12px', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto',
              fontFamily: 'Courier New, Courier, monospace', whiteSpace: 'pre-wrap', border: '1px solid #2d3748'
            }}>
              {lcuData.certificate || "⚠️ Không tìm thấy Chứng chỉ SSL"}
            </div>
          </div>
        </div>
      )}

      {/* Trạng thái Loading */}
      {!isLCUConnected && (
        <div style={{ marginTop: '30px', color: '#718096', display: 'flex', alignItems: 'center', fontSize: '15px' }}>
          <div className="spinner" style={{ marginRight: '12px' }}>⌛</div>
          <span>Đang đợi tín hiệu bảo mật từ LeagueClient.exe...</span>
        </div>
      )}
    </div>
  );
};

export default LcuInfo;