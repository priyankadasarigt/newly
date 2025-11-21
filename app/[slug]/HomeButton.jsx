'use client';

export default function HomeButton() {
  return (
    <>
      <a href="/" className="home-btn">Home</a>

      <style jsx>{`
        .home-btn {
          display: inline-block;
          margin: 20px auto;
          padding: 15px 35px;
          font-size: 20px;
          font-weight: bold;
          color: white;
          background: linear-gradient(90deg, #2196F3, #21CBF3);
          border-radius: 6px;
          text-decoration: none;
          transition: 0.25s ease;
        }
        .home-btn:hover {
          transform: scale(1.07);
          background: linear-gradient(90deg, #21CBF3, #2196F3);
        }
      `}</style>
    </>
  );
}
