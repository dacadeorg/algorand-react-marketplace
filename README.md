<div id="top"></div>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

[//]: # (<img src="./README/images/logo.png" alt="Logo" width="80" height="80" />)

[//]: # (  <a href="https://github.com/othneildrew/Best-README-Template">)


[//]: # (  </a>)

<h3 align="center">Algorand React Marketplace</h3>

</div>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)

<!-- GETTING STARTED -->

## :point_down: Getting Started

To get this project up running locally, follow these simple example steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) v16.xx.x

### Run locally

1. Clone repo
   ```sh
   git clone https://github.com/dacadeorg/algorand-react-marketplace.git
   ```

2. Install packages
   ```sh
   npm install
   ```
3. Run application
   ```sh
   npm run start
   ```
4. Open development server on http://localhost:3000

<p align="right">(<a href="#top">back to top</a>)</p>


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)

## :computer: Development: Connect account
### Local release network using sandbox
1. Export local account address with `./sandbox goal account export --address [account_address]`
2. Insert address at line 9 in `src/utils/constants.js`
3. Make sure `ENVIRONMENT` is set to `"release"` in line 13 `src/utils/constants.js`

### Testnet
1. Make sure `ENVIRONMENT` is set to `"testnet"` in line 13 `src/utils/constants.js`
2. Create account on testnet using https://wallet.myalgo.com/
3. Start app and connect to walle


<p align="right">(<a href="#top">back to top</a>)</p>


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)


<!-- CONTRIBUTING -->

## :writing_hand: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)


<!-- LICENSE -->

## :policeman: License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)

<!-- CONTACT -->

## :iphone: Contact

Visit us at - [Dacade](https://dacade.org)

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/dacadeorg/algorand-react-marketplace.svg?style=for-the-badge

[contributors-url]: https://github.com/dacadeorg/algorand-react-marketplace/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/dacadeorg/algorand-react-marketplace.svg?style=for-the-badge

[forks-url]: https://github.com/dacadeorg/algorand-react-marketplace/network/members

[stars-shield]: https://img.shields.io/github/stars/dacadeorg/algorand-react-marketplace.svg?style=for-the-badge

[stars-url]: https://github.com/dacadeorg/algorand-react-marketplace/stargazers

[issues-shield]: https://img.shields.io/github/issues/dacadeorg/algorand-react-marketplace.svg?style=for-the-badge

[issues-url]: https://github.com/dacadeorg/algorand-react-marketplace/issues

[license-shield]: https://img.shields.io/github/license/dacadeorg/algorand-react-marketplace.svg?style=for-the-badge

[license-url]: ./README/LICENSE.txt

[product-screenshot]: ./README/images/shot1.png

[product-screenshot-2]: ./README/images/shot2.png
