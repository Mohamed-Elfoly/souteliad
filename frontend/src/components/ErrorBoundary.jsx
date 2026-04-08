import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
            fontFamily: 'Rubik, sans-serif',
            direction: 'rtl',
            padding: '2rem',
            color: '#333',
          }}
        >
          <h2 style={{ fontSize: '1.5rem' }}>حدث خطأ غير متوقع</h2>
          <p style={{ color: '#888' }}>من فضلك أعد تحميل الصفحة أو تواصل مع الدعم.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#EB6837',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            إعادة التحميل
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
