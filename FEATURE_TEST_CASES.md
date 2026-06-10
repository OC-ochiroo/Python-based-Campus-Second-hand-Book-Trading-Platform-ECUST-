# Book2Go Platform - Feature Test Cases

**Project:** Campus Second-hand Book Trading Platform  
**Version:** 1.0  
**Date:** May 14, 2026  
**Status:** Development

---

## 1. Authentication & User Management

### 1.1 User Registration
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| AUTH-001 | Valid registration with all fields | 1. Navigate to RegisterPage 2. Enter valid email, username, password (8+ chars) 3. Click register | Account created, redirect to LoginPage | P0 |
| AUTH-002 | Registration with duplicate email | 1. Register user with test@example.com 2. Attempt register with same email | Error: "Email already exists" displayed | P0 |
| AUTH-003 | Registration with weak password | 1. Enter password < 8 characters 2. Submit form | Form validation: "Password must be 8+ characters" | P1 |
| AUTH-004 | Registration with invalid email format | 1. Enter invalid email (e.g., "testexample") 2. Submit | Form validation error shown | P1 |
| AUTH-005 | Empty required fields registration | 1. Leave email/username/password empty 2. Click register | Form validation prevents submission | P1 |

### 1.2 User Login
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| AUTH-006 | Valid login credentials | 1. Go to LoginPage 2. Enter valid email & password 3. Click login | JWT token created, redirect to HomePage | P0 |
| AUTH-007 | Invalid password | 1. Enter correct email, wrong password 2. Submit | Error: "Invalid credentials" | P0 |
| AUTH-008 | Non-existent user login | 1. Enter unregistered email 2. Submit | Error: "User not found" | P0 |
| AUTH-009 | Login with empty fields | 1. Leave email/password empty 2. Submit | Form validation prevents submission | P1 |
| AUTH-010 | JWT token persistence | 1. Login successfully 2. Check HTTP-only cookie | "access_token" cookie present with 60-min expiration | P1 |

### 1.3 Protected Routes & Session
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| AUTH-011 | Access protected route without login | 1. Clear cookies 2. Navigate to /profile | Redirect to LoginPage | P0 |
| AUTH-012 | Access protected route with valid token | 1. Login 2. Navigate to /my-posts | Page loads with user's content | P0 |
| AUTH-013 | Token expiration handling | 1. Login 2. Wait 60 minutes 3. Make request | Redirect to LoginPage, prompt re-login | P2 |
| AUTH-014 | Logout functionality | 1. Login 2. Click logout 3. Attempt access /profile | Cookie cleared, redirect to HomePage | P1 |

### 1.4 User Profile Management
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| USER-001 | View current user profile | 1. Login 2. Go to ProfilePage | Display current username, email, WeChat, age | P1 |
| USER-002 | Update user profile fields | 1. Click Edit 2. Change WeChat username 3. Save | Profile updated in database, changes reflected | P1 |
| USER-003 | Update age field | 1. Edit age 2. Save | Age updated successfully | P2 |
| USER-004 | Delete user account | 1. Click Delete Account 2. Confirm | User deleted from database, redirect to HomePage | P2 |

---

## 2. Book Marketplace - Browsing & Search

### 2.1 Feed Page - Display & Pagination
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| FEED-001 | Load feed page | 1. Navigate to FeedPage | Display paginated books (5 per page) with correct formatting | P0 |
| FEED-002 | Book card display | 1. View feed 2. Check book cards | Card shows: cover color, title, author, year, price, rating stars, owner | P0 |
| FEED-003 | Pagination - Next page | 1. View feed (page 1) 2. Click next | Load page 2 with new books | P1 |
| FEED-004 | Pagination - Previous page | 1. On page 2+ 2. Click previous | Load previous page | P1 |
| FEED-005 | Pagination - Beyond available books | 1. On last page 2. Click next | No action or disabled button | P2 |
| FEED-006 | Display total book count | 1. View feed | Show "Showing X of Y books" | P2 |

### 2.2 Search Functionality
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SEARCH-001 | Search by book title | 1. Enter book title in search 2. Press enter | Results filtered to matching titles | P0 |
| SEARCH-002 | Search by author name | 1. Enter author name 2. Submit | Results show books by that author | P0 |
| SEARCH-003 | Case-insensitive search | 1. Search "Python" 2. Search "python" | Same results returned | P1 |
| SEARCH-004 | Partial title match | 1. Search "Pro" (for "Programming") | Books containing "Pro" in title shown | P1 |
| SEARCH-005 | No search results | 1. Search non-existent book 2. Submit | "No books found" message displayed | P1 |
| SEARCH-006 | Clear search | 1. Search results displayed 2. Click clear | Return to full feed | P1 |

### 2.3 Filter Functionality
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| FILTER-001 | Filter by author | 1. Select author dropdown 2. Choose author | Show only books by selected author | P1 |
| FILTER-002 | Filter by year | 1. Enter year range 2. Apply | Show books published in range | P1 |
| FILTER-003 | Filter by minimum rating | 1. Set minimum rating 4★ 2. Apply | Show only books ≥ 4★ | P1 |
| FILTER-004 | Filter by maximum price | 1. Set max price $50 2. Apply | Show books ≤ $50 | P1 |
| FILTER-005 | Combine multiple filters | 1. Set author + year + price filters 2. Apply | Results intersect all filters | P1 |
| FILTER-006 | Reset all filters | 1. Apply filters 2. Click reset | Return to unfiltered feed | P1 |

### 2.4 Sorting
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SORT-001 | Sort by price - low to high | 1. Select sort option 2. Choose price ASC | Books sorted by price ascending | P2 |
| SORT-002 | Sort by price - high to low | 1. Select sort DESC | Books sorted by price descending | P2 |
| SORT-003 | Sort by rating - highest first | 1. Select rating sort | Books sorted by rating descending | P2 |
| SORT-004 | Sort by newest | 1. Select newest filter | Most recently posted books first | P2 |

---

## 3. Book Management - Create, Update, Delete

### 3.1 Create Book Post
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| POST-001 | Create book post with valid data | 1. Navigate to MyPostsPage 2. Click "Add Book" 3. Fill all fields 4. Submit | Book created in database, appears in feed | P0 |
| POST-002 | Create with missing title | 1. Leave title empty 2. Try submit | Form validation: "Title required" | P1 |
| POST-003 | Create with invalid price | 1. Enter negative price 2. Submit | Form validation: "Price must be > 0" | P1 |
| POST-004 | Create with missing description | 1. Leave description empty 2. Submit | Form validation: "Description required" | P1 |
| POST-005 | Verify book appears in MyPosts | 1. Create book 2. Check MyPostsPage | Book listed under user's posts | P1 |

### 3.2 Update Book Post
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| POST-006 | Edit book title | 1. Go to MyPostsPage 2. Click Edit 3. Change title 4. Save | Title updated in database and feed | P1 |
| POST-007 | Edit book price | 1. Click Edit 2. Change price 3. Save | Price updated immediately | P1 |
| POST-008 | Edit book rating | 1. Edit rating stars 2. Save | Rating updated, reflected in feed | P1 |
| POST-009 | Edit non-owned book | 1. Try to edit another user's book | Error: "Unauthorized" or button disabled | P1 |

### 3.3 Delete Book Post
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| POST-010 | Delete own book post | 1. Go to MyPostsPage 2. Click Delete 3. Confirm | Book removed from database and feed | P1 |
| POST-011 | Delete - confirmation dialog | 1. Click Delete | Confirmation dialog shown | P1 |
| POST-012 | Delete - cancel action | 1. Click Delete 2. Click Cancel | Book remains unchanged | P1 |
| POST-013 | Delete - cannot delete others' books | 1. Try to delete another user's book | Delete button disabled or error shown | P1 |

---

## 4. Personal Content Management

### 4.1 My Posts Page
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| MYPOST-001 | Load My Posts page | 1. Login 2. Navigate to MyPostsPage | Display user's book listings | P1 |
| MYPOST-002 | Empty My Posts | 1. User with no posts goes to MyPostsPage | "No books posted yet" message shown | P1 |
| MYPOST-003 | View multiple posts | 1. User with 5+ books 2. View MyPostsPage | All books displayed (paginated if needed) | P1 |
| MYPOST-004 | Action buttons visible | 1. On MyPostsPage | Edit and Delete buttons visible for each post | P1 |
| MYPOST-005 | Book count display | 1. View MyPostsPage | Show "You have X books posted" | P2 |

### 4.2 Profile Page
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| PROFILE-001 | Load profile page | 1. Navigate to ProfilePage | Display user info and recent posts | P1 |
| PROFILE-002 | Display user information | 1. View profile | Show username, email, WeChat, age | P1 |
| PROFILE-003 | Display recent posts preview | 1. View profile | Show last 3-5 user's book posts | P1 |
| PROFILE-004 | Click to view full posts | 1. Click "View All Posts" | Navigate to MyPostsPage | P2 |
| PROFILE-005 | Edit profile button | 1. Click Edit Profile | Open edit modal/form | P1 |

---

## 5. Trading & Transactions

### 5.1 Trade Request Creation
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| TRADE-001 | Create trade request | 1. View book in feed 2. Click "Trade/Offer" 3. Select book to offer 4. Submit | Trade request created, stored in database | P1 |
| TRADE-002 | Cannot trade own book | 1. Try to initiate trade for own book | Button disabled or error: "Cannot trade own book" | P1 |
| TRADE-003 | Trade request notification | 1. Receive trade request | User notified of incoming trade (UI pending) | P2 |

### 5.2 Trade Management
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| TRADE-004 | Accept trade request | 1. View incoming trade 2. Click Accept | Trade status = "accepted", books marked traded | P1 |
| TRADE-005 | Reject trade request | 1. View incoming trade 2. Click Reject | Trade status = "rejected" | P1 |
| TRADE-006 | Cancel own trade request | 1. View sent trade request 2. Click Cancel | Trade status = "cancelled" | P1 |
| TRADE-007 | View trade history | 1. Go to Trades section | Display completed trades (UI pending) | P2 |

---

## 6. UI/UX Components

### 6.1 Navigation
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| NAV-001 | Navbar displays correctly | 1. View any page | Navbar visible with navigation links | P1 |
| NAV-002 | Active route highlighting | 1. Click on nav link | Current page highlighted in navbar | P1 |
| NAV-003 | Logo navigation | 1. Click logo from any page | Navigate to HomePage | P1 |
| NAV-004 | User profile link visible | 1. Login 2. View navbar | Profile link available for logged-in user | P1 |
| NAV-005 | Logout button functional | 1. Logged in 2. Click logout | Session cleared, redirect to HomePage | P1 |
| NAV-006 | Login/Register links for guests | 1. Not logged in 2. View navbar | Login and Register links available | P1 |

### 6.2 Book Card Component
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| CARD-001 | Book card renders all fields | 1. View book card | Show: cover color, title, author, year, price, rating, owner | P1 |
| CARD-002 | Card responsive design | 1. Resize viewport 2. View card | Card maintains readability on mobile/tablet/desktop | P1 |
| CARD-003 | Rating stars display | 1. View card with rating 4.5★ | Display 4 full stars + 1 half star | P1 |
| CARD-004 | Clickable card | 1. Click book card | Navigate to book details (if detail page exists) | P2 |
| CARD-005 | Book card styling | 1. View multiple cards | Cards have consistent styling and spacing | P1 |

### 6.3 Button Component
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| BTN-001 | Button click handler | 1. Click button | Corresponding action triggered | P1 |
| BTN-002 | Button loading state | 1. Click form submit button | Show loading indicator during request | P2 |
| BTN-003 | Disabled button state | 1. Button disabled (form invalid) | Button appears grayed out, not clickable | P1 |
| BTN-004 | Button hover effect | 1. Hover over button | Visual feedback (color change/shadow) | P1 |

### 6.4 Form Validation
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| FORM-001 | Required field validation | 1. Leave required field empty 2. Submit | Error message displayed, form not submitted | P1 |
| FORM-002 | Email format validation | 1. Enter invalid email 2. Submit | Error: "Invalid email format" | P1 |
| FORM-003 | Real-time validation feedback | 1. Enter invalid data | Error shows immediately without submit | P1 |
| FORM-004 | Success message display | 1. Submit valid form | Success toast/notification appears | P1 |

---

## 7. Error Handling & Edge Cases

### 7.1 Network & Server Errors
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| ERROR-001 | Server 500 error | 1. Trigger server error 2. Observe | User-friendly error message shown, app stable | P1 |
| ERROR-002 | Network timeout | 1. Slow network 2. Make request | Timeout message after 30 seconds | P1 |
| ERROR-003 | Failed API call retry | 1. API request fails 2. Auto retry logic | Retry attempted up to 3 times | P2 |
| ERROR-004 | CORS error handling | 1. Invalid CORS request | Browser console error, graceful degradation | P2 |

### 7.2 Database Issues
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| DB-001 | Database connection failure | 1. DB connection fails | Error message, app remains responsive | P1 |
| DB-002 | Concurrent requests | 1. Simultaneous API calls from multiple tabs | Database handles concurrency correctly | P1 |
| DB-003 | Large dataset handling | 1. Feed with 1000+ books 2. Load feed | Page loads in < 2 seconds | P2 |

### 7.3 Malformed Input
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| INPUT-001 | SQL injection attempt | 1. Enter SQL in search field | Query sanitized, no injection | P0 |
| INPUT-002 | XSS attempt in book title | 1. Create book with script tag in title | Script not executed, displayed as text | P0 |
| INPUT-003 | Very long strings | 1. Enter 10,000 char description | Truncated or rejected gracefully | P1 |
| INPUT-004 | Special characters in fields | 1. Enter emoji/unicode in username | Accepted or rejected with clear message | P1 |

---

## 8. Performance & Load Testing

### 8.1 Response Time
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| PERF-001 | HomePage load time | 1. Navigate to homepage | Page loads in < 2 seconds | P2 |
| PERF-002 | Feed page pagination | 1. Load feed page 2 | Load next 5 books in < 1 second | P2 |
| PERF-003 | Search response time | 1. Enter search term | Results appear in < 500ms | P2 |
| PERF-004 | API response time | 1. Any API call | Response received in < 1 second | P2 |

### 8.2 Load Testing
| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| LOAD-001 | 100 concurrent logins | 1. Simulate 100 users login simultaneously | All logins successful, no 500 errors | P3 |
| LOAD-002 | Browse with high load | 1. Feed page with 100 users browsing | Page remains responsive, < 2 sec load | P3 |
| LOAD-003 | Database query optimization | 1. Monitor slow queries | All queries complete in < 100ms | P2 |

---

## Testing Priorities

- **P0 (Critical):** Core functionality - must pass before release
- **P1 (High):** Important features - should pass before release  
- **P2 (Medium):** Nice-to-have features - can be fixed post-launch
- **P3 (Low):** Performance optimization - can be addressed later

---

## Test Execution Checklist

- [ ] Run authentication test suite (AUTH-001 to AUTH-014)
- [ ] Run marketplace browsing tests (FEED-001 to SORT-004)
- [ ] Run CRUD operations (POST-001 to POST-013)
- [ ] Run component tests (NAV-001 to FORM-004)
- [ ] Run error handling (ERROR-001 to INPUT-004)
- [ ] Run performance tests (PERF-001 to LOAD-003)
- [ ] Generate test coverage report
- [ ] Manual UAT with real users

---

**Document Version:** 1.0  
**Last Updated:** May 14, 2026  
**Next Review:** After first sprint completion
