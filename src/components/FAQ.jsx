import React, { useState } from "react";
import "../stylesheets/Faq.css";

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "Why is review management important?",
      answer:
        "Review management is important because it helps businesses monitor and respond to customer feedback, improving their reputation and customer trust.",
    },
    {
      question: "What is a review management service?",
      answer:
        "A review management service helps businesses collect, monitor, and respond to online reviews across various platforms.",
    },
    {
      question: "How much does reputation resolution cost?",
      answer:
        "The cost of reputation resolution varies depending on the service provider and the level of service required.",
    },
    {
      question: "How do I start using the Review Management tool?",
      answer:
        "To start using the Review Management tool, sign up on our website, choose your plan, and follow the onboarding instructions.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription by going to your account settings and selecting the cancel subscription option.",
    },
  ];

  return (
    <div className="faq-container">
      <h2>Frequently asked questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div
            className="faq-question"
            onClick={() => toggleQuestion(index)}
          >
            {openQuestion === index ? "▼" : "►"} {faq.question}
          </div>
          {openQuestion === index && (
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
