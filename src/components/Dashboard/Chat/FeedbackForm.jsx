import React, { useState } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext.jsx';
import './FeedbackForm.css';

// Confirmation Screen Component
const ConfirmationScreen = ({ onClose, isDarkMode }) => {
  return (
    <div className={`feedback-form-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feedback-form-container confirmation-container">
        <div className="confirmation-header">
          <div className="confirmation-icon-wrapper">
            <div className="confirmation-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
          </div>
          <h3 className="confirmation-title">Thank You!</h3>
          <p className="confirmation-subtitle">Your feedback has been submitted successfully</p>
        </div>
        <div className="confirmation-content">
          <p className="confirmation-message">
            We appreciate you taking the time to help us improve Delphi's responses. 
            Your input makes a real difference!
          </p>
        </div>
        <div className="confirmation-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary confirmation-btn"
          >
            <span>Continue</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackForm = ({ onSubmit, onCancel, isVisible }) => {
  const { isDarkMode } = useDarkMode();
  const [satisfaction, setSatisfaction] = useState(null);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const satisfactionOptions = [
    { value: 'very-satisfied', label: 'Very Satisfied', emoji: '😊' },
    { value: 'satisfied', label: 'Satisfied', emoji: '🙂' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'dissatisfied', label: 'Dissatisfied', emoji: '😕' },
    { value: 'very-dissatisfied', label: 'Very Dissatisfied', emoji: '😞' }
  ];

  const reasonOptions = [
    'Response was not helpful',
    'Response was too long/short',
    'Response was inaccurate',
    'Response was irrelevant',
    'Technical issues',
    'Poor formatting',
    'Missing information',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate satisfaction (required)
    if (!satisfaction) {
      newErrors.satisfaction = 'Please select your satisfaction level';
    }

    // Validate reason if not satisfied or neutral (required)
    if (satisfaction && ['dissatisfied', 'very-dissatisfied', 'neutral'].includes(satisfaction) && !reason) {
      newErrors.reason = satisfaction === 'neutral' 
        ? 'Please select a reason for your neutral rating' 
        : 'Please select a reason for your dissatisfaction';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit feedback
    onSubmit({
      satisfaction,
      reason: ['dissatisfied', 'very-dissatisfied', 'neutral'].includes(satisfaction) ? reason : null,
      comment: comment.trim() || null
    });

    // Show confirmation screen
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setSatisfaction(null);
    setReason('');
    setComment('');
    setErrors({});
    onCancel();
  };

  const handleConfirmationClose = () => {
    // Reset form
    setSatisfaction(null);
    setReason('');
    setComment('');
    setErrors({});
    setShowConfirmation(false);
    // Close the entire feedback modal
    onCancel();
  };

  if (!isVisible) return null;

  // Show confirmation screen if feedback was submitted
  if (showConfirmation) {
    return <ConfirmationScreen onClose={handleConfirmationClose} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`feedback-form-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feedback-form-container">
        <div className="feedback-form-header">
          <h3>How was your chat experience?</h3>
          <p>Your feedback helps us improve Delphi's responses</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Satisfaction Level */}
          <div className="form-group">
            <label className="form-label required">Satisfaction Level</label>
            <div className="satisfaction-options">
              {satisfactionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`satisfaction-option ${satisfaction === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    setSatisfaction(option.value);
                    setErrors(prev => ({ ...prev, satisfaction: null }));
                  }}
                >
                  <span className="satisfaction-emoji">{option.emoji}</span>
                  <span className="satisfaction-label">{option.label}</span>
                </button>
              ))}
            </div>
            {errors.satisfaction && (
              <span className="error-message">{errors.satisfaction}</span>
            )}
          </div>

          {/* Reason for Dissatisfaction or Neutral */}
          {satisfaction && ['dissatisfied', 'very-dissatisfied', 'neutral'].includes(satisfaction) && (
            <div className="form-group">
              <label className="form-label required">
                {satisfaction === 'neutral' ? 'Reason for Neutral Rating' : 'Reason for Dissatisfaction'}
              </label>
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors(prev => ({ ...prev, reason: null }));
                }}
                className="form-select"
              >
                <option value="">Select a reason...</option>
                {reasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <span className="error-message">{errors.reason}</span>
              )}
            </div>
          )}

          {/* Comment Box */}
          <div className="form-group">
            <label className="form-label">Additional Comments (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

