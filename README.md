## 📄 API Documentation

[![Postman Docs](https://img.shields.io/badge/View%20in-Postman-orange?logo=postman)](https://documenter.getpostman.com/view/42731567/2sAYdhLApK)

## 📷 Screenshots

<p align="center">
  <img src="https://github.com/Byr4x/Girasol_TechnicalTest/blob/master/docs/images/POST.png" width="45%">
  <img src="https://github.com/Byr4x/Girasol_TechnicalTest/blob/master/docs/images/GET.png" width="45%">
</p>


## Changelog  

**Update made at 🕔 5:02 AM - 01/03/2025**.
 - Added Redis caching for storing exchange rates from the external API [`f3a6d27`](https://github.com/Byr4x/Girasol_TechnicalTest/commit/f3a6d27).

I already had the Redis configuration set up, but, I just woke up and, while reviewing what I sent, I noticed that I wasn’t using it. So now I store the information in Redis.


**Update made at 🕔 3:35 AM - 03/03/2025**.
- ADDED USER ID MANAGEMENT AND HISTORY RETRIEVAL PER USER [`acf6d38`](https://github.com/Byr4x/Girasol_TechnicalTest/commit/acf6d38).

The correction was made because I initially overlooked that the history needed to be retrieved per user. To fix this, I researched ways to obtain a device-specific ID and use it as the user ID. This ensures that each time the program runs, it retrieves the same history and stores data under the same user ID. The options I found were using the MAC address or a UUID. I chose the latter because a MAC address could change if the user switches networks or uses a VPN. Now, the API generates a plain text file with a UUID named "user-id", storing it in a ".currency-converter" folder within the active user's directory.
