# Hoi An Link Audit

Checked at: 2026-04-03T07:59:56.799Z

This file lists cafes whose current website / Facebook link looks suspicious and should be manually reviewed before marking them closed.

## Flagged For Review

### Sound Of Silence Coffee Shop
- Address: 40 Nguyễn Phan Vinh, Cẩm An, Hội An, Quảng Nam 560000, Vietnam
- URL: https://soundofsilencecoffee.business.site/?utm_source=gmb&utm_medium=referral
- Finding: URL returned HTTP 404
- HTTP status: 404

### Buttercup by Rosie's Cafe
- Address: 12/9 Bạch Đằng, Cẩm Châu, Hội An, Quảng Nam 560000, Vietnam
- URL: https://buttercuphoian.com/
- Finding: Website redirects to suspended hosting page
- HTTP status: 302
- Redirect: https://buttercuphoian.com/cgi-sys/suspendedpage.cgi

### The Little River Cafe
- Address: Thôn Vạn Lăng, Cẩm Thanh, Hội An, Quảng Nam, Vietnam
- URL: https://www.facebook.com/The-Little-RIVER-CAFE-669304489868094/
- Finding: Facebook URL redirects to a different page: /mrtaistours
- HTTP status: 301
- Redirect: https://www.facebook.com/mrtaistours

## Full Summary

- Hub Hoi An Coworking: ok (HTTP 200)
- Hoi An Roastery - Lê Lợi: ok (Redirects to https://hoianroastery.com/)
- Sound Of Silence Coffee Shop: suspected_closed (URL returned HTTP 404)
- Buttercup by Rosie's Cafe: suspected_closed (Website redirects to suspended hosting page)
- Dudu Cafe: ok (HTTP 200)
- Faifo Coffee: ok (HTTP 200)
- Moments Hoi An: ok (HTTP 200)
- Roving ChillHouse: ok (HTTP 200)
- The Little River Cafe: review (Facebook URL redirects to a different page: /mrtaistours)
