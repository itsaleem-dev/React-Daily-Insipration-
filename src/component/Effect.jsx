import { useEffect, useState } from 'react';
import './Effect.css';

export default function Effect() {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [copied, setCopied] = useState(false);

    async function ApiCall() {
        setLoading(true);
        setCopied(false);

        try {
            const result = await fetch(
                'https://api.adviceslip.com/advice'
            );

            if (!result.ok) {
                throw new Error('API request failed');
            }

            const data = await result.json();
            setAdvice(data.slip.advice);
        } catch (error) {
            setAdvice('Oops! Advice load nahi hui. Dobara try karo.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        ApiCall();
    }, []);

    async function copyAdvice() {
        if (!advice) return;

        try {
            await navigator.clipboard.writeText(advice);
            setCopied(true);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }

    function saveFavorite() {
        if (!advice || favorites.includes(advice)) return;

        setFavorites((prev) => [...prev, advice]);
    }

    function removeFavorite(item) {
        setFavorites((prev) => prev.filter((fav) => fav !== item));
    }

    return (
        <div className="app">
            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <main className="advice-card">
                <div className="top-label">
                    <span className="live-dot"></span>
                    DAILY INSPIRATION
                </div>

                <div className="icon-box">✦</div>

                <h1>
                    A Little <span>Wisdom</span>
                </h1>

                <p className="subtitle">
                    A fresh perspective for your day.
                </p>

                <div className="quote-mark">“</div>

                <div className="advice-content">
                    {loading ? (
                        <div className="loader">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) : (
                        <p className="advice-text">
                            {advice || 'Your inspiration is loading...'}
                        </p>
                    )}
                </div>

                <div className="divider">
                    <span></span>
                    <span>✦</span>
                    <span></span>
                </div>

                <div className="button-group">
                    <button
                        className="btn btn-primary"
                        onClick={ApiCall}
                        disabled={loading}
                    >
                        <span>↻</span>
                        {loading ? 'Loading...' : 'New Advice'}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={copyAdvice}
                        disabled={loading || !advice}
                    >
                        <span>▢</span>
                        {copied ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={saveFavorite}
                        disabled={!advice || loading}
                    >
                        <span>♡</span>
                        Save
                    </button>
                </div>

                <p className="footer-text">
                    MADE FOR YOUR MIND <span>✦</span>
                </p>
            </main>

            <section className="favorites-card">
                <div className="favorites-heading">
                    <div>
                        <span className="section-kicker">YOUR COLLECTION</span>
                        <h2>Favorite Advice</h2>
                    </div>

                    <span className="count-badge">
                        {favorites.length}
                    </span>
                </div>

                {favorites.length === 0 ? (
                    <p className="empty-text">
                        ♡ Your favorite advice will appear here.
                    </p>
                ) : (
                    <div className="favorites-list">
                        {favorites.map((item, index) => (
                            <div className="favorite-item" key={item}>
                                <span className="favorite-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <p>{item}</p>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFavorite(item)}
                                    aria-label="Remove favorite"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}