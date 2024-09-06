

import React from 'react';

const Noreview = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Build loyalty by answering the reviews and engaging in dialogue</h1>
        <img 
          src='https://static.semrush.com/listing-management/landings/assets/screen_1-Dtw4FurQ.webp' 
          alt="Review Engagement" 
          style={styles.image}
        />
        <div style={{ ...styles.box, ...styles.box1 }}>
          Monitor the most popular review platforms such as Google, Facebook, and Yelp, and respond quickly and easily to your reviews
          <div style={{ ...styles.arrow, ...styles.arrow1 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box2 }}>
          Protect your online reputation by addressing reviews directly. Prioritize by location, rating, date submitted, and response status
          <div style={{ ...styles.arrow, ...styles.arrow2 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box3 }}>
          Create intimate conversations with clients that increase engagement and loyalty, influence new customers, and give your brand social proof
          <div style={{ ...styles.arrow, ...styles.arrow3 }} />
        </div>
      </div>

      <div style={styles.card}>
        <h1 style={styles.heading}>Enhance your online reputation with key data-driven insights</h1>
        <img 
          src='https://static.semrush.com/listing-management/landings/assets/screen_2-CpcugRom.webp' 
          alt="Online Reputation" 
          style={styles.image}
        />
        <div style={{ ...styles.box, ...styles.box4 }}>
          Track your reply rate for Google reviews, and ensure that you’re engaging with each and every customer
          <div style={{ ...styles.arrow, ...styles.arrow4 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box5 }}>
          Identify how your brand is perceived with a high-level overview of your historical ratings, and check for improvements
          <div style={{ ...styles.arrow, ...styles.arrow5 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box6 }}>
          Measure your progress in numbers. See your total number of reviews, average rating, and score distribution to understand potential trends
          <div style={{ ...styles.arrow, ...styles.arrow6 }} />
        </div>
      </div>

      <div style={styles.card}>
        <h1 style={styles.heading}>Go beyond reviews—capture local listings and analytics</h1>
        <img 
          src='https://static.semrush.com/listing-management/landings/assets/screen_3A-DVR5jMQD.webp' 
          alt="Local Listings" 
          style={styles.image}
        />
        <div style={{ ...styles.box, ...styles.box7 }}>
          Connect to your Google Business Profile. Add in GBP detailed business information that will help searchers to choose your services
          <div style={{ ...styles.arrow, ...styles.arrow7 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box8 }}>
          Spread info in the most visited local directories. Create your business listing in any of 150+ globally supported directories within minutes
          <div style={{ ...styles.arrow, ...styles.arrow8 }} />
        </div>
        <div style={{ ...styles.box, ...styles.box9 }}>
          Check Google Maps rankings. See how your business ranks in map search results and keep an eye on competitors
          <div style={{ ...styles.arrow, ...styles.arrow9 }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '40px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    // overflow: 'hidden',
  },
  heading: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  box: {
    position: 'absolute',
    backgroundColor: 'rgba(128, 0, 128, 0.75)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'left',
  },
  arrow: {
    width: '0', 
    height: '0', 
    borderStyle: 'solid',
    position: 'absolute',
  },
  box1: {
    top: '30%',
    left: '-30%',
    width: '35%',
  },
  arrow1: {
    top: '60%',
    left: '100%',
    borderWidth: '10px 0 10px 10px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box2: {
    top: '65%',
    right: '-25%',
    width: '35%',
  },
  arrow2: {
    top: '75%',
    right: '100%',
    borderWidth: '10px 10px 10px 0',
    borderColor: 'transparent rgba(128, 0, 128, 0.75) transparent transparent',
  },
  box3: {
    bottom: '5%',
    left: '-30%',
    width: '35%',
  },
  arrow3: {
    bottom: '20%',
    left: '100%',
    borderWidth: '15px 0 15px 40px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box4: {
    top: '25%',
    left: '-35%',
    width: '35%',
  },
  arrow4: {
    top: '20%',
    left: '100%',
    borderWidth: '10px 0 10px 10px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box5: {
    top: '60%',
    left: '-30%',
    width: '30%',
  },
  arrow5: {
    top: '75%',
    left: '100%',
    borderWidth: '10px 0 10px 10px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box6: {
    bottom: '15%',
    right: '-35%',
    width: '35%',
  },
  arrow6: {
    bottom: '20%',
    right: '100%',
    borderWidth: '10px 10px 10px 0',
    borderColor: 'transparent rgba(128, 0, 128, 0.75) transparent transparent',
  },
  box7: {
    top: '45%',
    left: '-33%',
    width: '35%',
  },
  arrow7: {
    top: '20%',
    left: '100%',
    borderWidth: '20px 0 20px 200px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box8: {
    top: '80%',
    left: '-35%',
    width: '30%',
  },
  arrow8: {
    top: '15%',
    left: '100%',
    borderWidth: '15px 0 15px 80px',
    borderColor: 'transparent transparent transparent rgba(128, 0, 128, 0.75)',
  },
  box9: {
    bottom: '5%',
    right: '-35%',
    width: '35%',
  },
  arrow9: {
    bottom: '60%',
    right: '100%',
    borderWidth: '10px 10px 2px 0',
    borderColor: 'transparent rgba(128, 0, 128, 0.75) transparent transparent',
  },
};

export default Noreview;
