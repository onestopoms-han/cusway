import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CUSWAY ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 24px',
          maxWidth: '640px',
          margin: '40px auto',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #fecaca',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          color: '#0f172a'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px', color: '#991b1b' }}>
            {this.props.fallbackTitle || '화면 전환 중 일시적인 렌더링 오류가 발생했습니다'}
          </h3>

          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
            요청하신 통관 단계의 데이터 연동 과정에서 오류가 감지되었습니다.<br />
            아래 버튼을 눌러 안전하게 이전 화면으로 돌아가시거나 화면을 다시 불러올 수 있습니다.
          </p>

          {this.state.error && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '0.78rem',
              color: '#dc2626',
              fontFamily: 'monospace',
              marginBottom: '24px',
              overflowX: 'auto',
              maxHeight: '120px'
            }}>
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#0d9488',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
              }}
            >
              <ArrowLeft size={16} /> 안전 화면으로 돌아가기
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} /> 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
