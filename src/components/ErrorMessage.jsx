function ErrorMessage({ message }) {
    <button onClick={() => window.location.reload()}>
  Retry
</button>
  return (
    <div>
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;