class CircuitBreaker {
  constructor(maxFailures = 5, cooldownPeriod = 60000) {
    this.maxFailures = maxFailures;
    this.cooldownPeriod = cooldownPeriod;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  recordSuccess() {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.maxFailures) {
      this.state = 'OPEN';
    }
  }

  isOpen() {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownPeriod) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      maxFailures: this.maxFailures,
      lastFailureTime: this.lastFailureTime
    };
  }
}

module.exports = CircuitBreaker;
