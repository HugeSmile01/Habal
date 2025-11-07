# Pre-Deployment Checklist for Habal Platform

⚠️ **IMPORTANT: Complete ALL items before deploying to production**

## Critical Configuration

### Firebase Configuration

- [ ] **Replace Firebase placeholders in `public/firebase-messaging-sw.js`**
  - [ ] Replace `YOUR_API_KEY`
  - [ ] Replace `YOUR_AUTH_DOMAIN`
  - [ ] Replace `YOUR_PROJECT_ID`
  - [ ] Replace `YOUR_STORAGE_BUCKET`
  - [ ] Replace `YOUR_MESSAGING_SENDER_ID`
  - [ ] Replace `YOUR_APP_ID`
  - [ ] Verify config matches Firebase Console settings

- [ ] **Set environment variables (`.env.local` or hosting platform)**
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
  - [ ] `VITE_FIREBASE_MEASUREMENT_ID`
  - [ ] `VITE_FIREBASE_VAPID_KEY` (for FCM)
  - [ ] `VITE_RADAR_API_KEY` (for location services)

### Location Data

- [ ] **Verify barangay coordinates in `src/constants/locations.js`**
  - [ ] Test coordinates with actual GPS devices
  - [ ] Verify locations match physical barangay boundaries
  - [ ] Update with accurate pickup points (e.g., barangay halls)
  - [ ] Document accuracy requirements in comments
  - [ ] Consider adding multiple pickup points per barangay

### Security

- [ ] **Firebase Security Rules**
  - [ ] Configure Firestore security rules
  - [ ] Configure Storage security rules
  - [ ] Enable Firebase App Check (recommended)
  - [ ] Set up rate limiting

- [ ] **Environment Security**
  - [ ] Never commit `.env.local` to version control
  - [ ] Use different credentials for dev/staging/production
  - [ ] Rotate API keys regularly
  - [ ] Enable 2FA on Firebase Console account

## Build and Testing

### Build Verification

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` to create production build
- [ ] Verify build completes without errors
- [ ] Check build output size (should be reasonable)
- [ ] Test production build locally with `npm run preview`

### Code Quality

- [ ] Run `npm run lint` - should pass with 0 warnings
- [ ] Run `npm run type-check` if applicable
- [ ] Review all console.log statements (remove or use proper logging)
- [ ] Check for commented-out code to remove

### Functional Testing

- [ ] **Authentication**
  - [ ] User registration (Passenger)
  - [ ] User registration (Driver)
  - [ ] Login with email/password
  - [ ] Logout
  - [ ] Password reset (if implemented)

- [ ] **Passenger Features**
  - [ ] Request ride with current location
  - [ ] Request ride with barangay selection
  - [ ] Request ride with address search
  - [ ] View ride history
  - [ ] See active rides
  - [ ] Receive ride acceptance notification
  - [ ] All tabs work correctly

- [ ] **Driver Features**
  - [ ] View available rides
  - [ ] Accept ride with custom fee
  - [ ] View active rides
  - [ ] View completed rides
  - [ ] Update ride status
  - [ ] All tabs work correctly
  - [ ] Location tracking works

- [ ] **Notifications (FCM)**
  - [ ] Permission request appears
  - [ ] Foreground notifications display
  - [ ] Background notifications work
  - [ ] Service worker registers correctly
  - [ ] Notification actions work
  - [ ] Tokens saved to user profile

- [ ] **Error Handling**
  - [ ] Test with no internet connection
  - [ ] Test with denied permissions
  - [ ] Test with invalid inputs
  - [ ] Verify user-friendly error messages
  - [ ] Check error logging

### Responsive Design Testing

- [ ] **Mobile Devices** (< 480px)
  - [ ] iPhone SE / 5 (320px)
  - [ ] iPhone 12/13 (390px)
  - [ ] Android phones (360px-414px)
  - [ ] Test in portrait and landscape

- [ ] **Tablets** (480px - 768px)
  - [ ] iPad Mini
  - [ ] iPad
  - [ ] Android tablets

- [ ] **Desktop** (> 768px)
  - [ ] 1024px (small laptop)
  - [ ] 1366px (standard laptop)
  - [ ] 1920px (full HD)

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance

- [ ] Check Lighthouse scores:
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] Test page load times
- [ ] Verify bundle sizes are optimized
- [ ] Check for memory leaks
- [ ] Test with slow 3G connection

## Deployment Configuration

### Hosting Platform

- [ ] Choose hosting platform (Firebase Hosting, Vercel, Netlify, etc.)
- [ ] Set up custom domain (if applicable)
- [ ] Configure HTTPS (required for service workers and FCM)
- [ ] Set up CDN if needed
- [ ] Configure caching headers

### Environment Variables on Hosting Platform

- [ ] Set all `VITE_*` environment variables
- [ ] Verify variables are encrypted/secured
- [ ] Document variable meanings
- [ ] Set up separate environments (staging, production)

### DNS and SSL

- [ ] Configure DNS records
- [ ] Enable SSL/TLS certificate
- [ ] Test HTTPS connection
- [ ] Set up automatic certificate renewal
- [ ] Configure redirect from HTTP to HTTPS

## Post-Deployment

### Immediate Checks

- [ ] Verify site loads correctly
- [ ] Test user registration
- [ ] Test login
- [ ] Test ride request flow
- [ ] Test driver acceptance flow
- [ ] Verify FCM notifications work
- [ ] Check all images load
- [ ] Test on multiple devices

### Monitoring Setup

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable Firebase Analytics
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up alerting for critical errors

### Documentation

- [ ] Update README with deployment info
- [ ] Document environment variables
- [ ] Create user guide
- [ ] Create admin guide (if applicable)
- [ ] Document API endpoints (if any)

## Known Issues to Address

### Current Limitations

- [ ] Barangay coordinates are approximate - need verification
- [ ] FCM backend integration not implemented (manual setup required)
- [ ] No map visualization (future enhancement)
- [ ] No SMS fallback for notifications
- [ ] No payment integration yet

### Recommendations

1. **Barangay Coordinates:**
   - Conduct field survey with GPS device
   - Mark actual barangay halls or common pickup points
   - Update `src/constants/locations.js` with accurate data
   - Add accuracy metadata to each location

2. **FCM Backend:**
   - Implement Firebase Cloud Functions for automated notifications
   - Set up triggers for ride events (accepted, started, completed)
   - Add notification templates
   - Implement notification queue for reliability

3. **Testing:**
   - Set up automated E2E tests (Playwright, Cypress)
   - Create test data for development
   - Set up CI/CD pipeline
   - Implement staging environment

4. **Monitoring:**
   - Monitor FCM delivery rates
   - Track user engagement metrics
   - Monitor ride completion rates
   - Set up alerts for errors

## Rollback Plan

In case of critical issues:

1. [ ] Keep previous version accessible
2. [ ] Document rollback procedure
3. [ ] Test rollback process
4. [ ] Have contact list for emergency support
5. [ ] Plan communication to users if needed

## Legal and Compliance

- [ ] Terms of Service accepted by users
- [ ] Privacy Policy displayed and accepted
- [ ] Data retention policy documented
- [ ] GDPR compliance (if applicable)
- [ ] User data export capability
- [ ] User data deletion capability

## Support Preparation

- [ ] Create user support documentation
- [ ] Set up support email/channel
- [ ] Train support staff
- [ ] Create FAQ document
- [ ] Set up feedback mechanism

## Final Sign-Off

- [ ] Developer review complete
- [ ] QA testing complete
- [ ] Security review complete
- [ ] Product owner approval
- [ ] Deployment scheduled
- [ ] Rollback plan ready
- [ ] Support team notified

---

**Deployment Date:** ___________

**Deployed By:** ___________

**Production URL:** ___________

**Notes:**
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

---

## Emergency Contacts

- **Technical Lead:** ___________
- **Firebase Admin:** ___________
- **Hosting Support:** ___________
- **On-Call Developer:** ___________

---

**Remember:** It's better to delay deployment than to deploy with known critical issues!
