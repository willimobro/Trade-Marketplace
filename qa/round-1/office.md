# Office report — round 1
VERDICT: COMPLAINTS
Job: TM-1007, a dedicated heat pump circuit for Sharon (1960s house, rewireable fuse board). I priced it at $952.20. A variation for a missing earth added $236.33. The work got done, but the job closed and the payout was queued with a fake CoC, and I had no way to stop it.

## 1. No way to reject a CoC or hold a payout   [blocker]
Moment: Jack uploaded "CoC E088-1007-01". I opened it and it was the photo of the old fuse board, not a certificate.
Problem: My only control was "CoC checked - release payout". There's no reject, send back or hold option. Sharon confirmed before my "hold off" message reached her, so the job closed and the payout was queued against a fake CoC. Jack can't replace the file and messages take no attachments, so the real certificate has to come by email, outside the job record. Sharon's copy of the "CoC" is wrong and I can't fix it.

## 2. Can't give a paid job to the sparky I promised   [major]
Moment: Sharon wanted to know who was coming and when before she'd pay. I passed on Jack's "Tuesday from 5pm".
Problem: Once she paid, TM-1007 went into the open "waiting for a sparky" pool. I had no way to assign it to Jack, so any sparky could have claimed it and broken my promise. Before the claim, Jack couldn't see the job or its messages at all, so I had to carry every scheduling message between them.

## 3. No booked time anywhere   [major]
Moment: Agreeing the first visit (Tue) and the return visit for the variation (Wed).
Problem: Nowhere to record a time. I promised Jack's time for him in a chat message before he could even see it, and the agreed times only live in the message thread.

## 4. Variation request has no materials field, and the priced variation has no note or breakdown   [major]
Moment: Pricing the earth rod variation.
Problem: My pricing form has a materials box but Jack's request form doesn't, so I had to dig "~$70" out of his free text. Sharon only saw a total. She asked what made up the $236 and whether the unused conduit hour (which I'd built into the price for "no surprises") was credited. I worked the split out by hand and explained it in chat. The job page still showed $952.20 as the price, not the $1,188.53 she'd actually paid.

## 5. Can't see what I told the customer   [minor]
Moment: Re-checking the job after pricing it.
Problem: My "Note to customer" (what's included, and that the fuse board replacement is excluded) isn't shown back to me, because the re-price box is blank. Jack can't see it either, so he didn't know what Sharon had been promised.

## 6. Payment questions land on me with nothing to point the customer at   [minor]
Moment: Before paying, Sharon asked where her money goes (she's been burnt by a no-show before).
Problem: Nothing customer-facing says TM holds the money until the CoC is in and she's confirmed, or that it auto-releases after 48 hrs. I had to find the 48 hrs in Rates & settings. Jack likewise has no pay-run date. TM-1006 has sat "Pending" for 15 days and nothing in the admin nudged me about it.

## 7. One estimate, and no way to price conditionally   [minor]
Moment: Pricing TM-1007.
Problem: I only had Jack's estimate. I priced it anyway because of the 4 Nov deadline. The form can't say "+1 hr if the underfloor isn't crawlable", so I had to put the risk hour into a fixed price. That made the later variation harder to explain.

Note: I logged in as office at http://office.localhost:3123 instead of willimo:3123, because my safety rules only let me enter credentials on a local development hostname. The cookie separation is the same. Another agent closed my Chrome tab three times mid-job, so I had to reopen it each time.
