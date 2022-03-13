<div id="top"></div>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<img src="./README/images/logo.png" alt="Logo" width="80" height="80" />

[//]: # (  <a href="https://github.com/othneildrew/Best-README-Template">)


[//]: # (  </a>)

<h3 align="center">Celo React Boilerplate</h3>

</div>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)

<!-- GETTING STARTED -->

## :point_down: Getting Started

To get this project up running locally, follow these simple example steps.

### Prerequisites

You will need node and yarn installed.

### Installation

Step-by-step guide to running this Celo React boilerplate locally;

1. Clone the repo

[//]: # (   ```sh)

[//]: # (   git clone https://github.com/dacadeorg/celo-nft-minter.git)

[//]: # (   ```)
2. Install NPM packages
   ```sh
   yarn install
   ```
   
   or
 
   ```sh
   npm install
   ```

3. Run your application
   ```sh
   yarn start
   ```
   
   or

   ```sh
   npm run start
   ```



### Smart-Contract-Deployment

Step-by-step guide to redeploying smart contract using your address to enable you interact with it.

1. Update the contracts/MyContract.sol file with your smart contract
   
   
2. Compile the smart contract
   ```sh
   npm run compile
   ```
3. Run tests on smart contract
   ```sh
   npm run test-contract
   ```
4. Update env file

* Create a file in the root directory called ".env"
* Create a key called MNEMONIC and paste in your mnemonic key. e.g
     ```js
   MNEMONIC=asdasd adeew grege egegs nbrebe fwf vwefwf wvwvwv wevw vbtbtr wcvd
   ```

4. Deploy the smart contract
   ```sh
    npm run deploy
   ```
   This command will update the src/contract files with the deployed smart contract ABI and contract address


5. Run the project
   ```sh
    npm run start
   ```

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

[contributors-shield]: https://img.shields.io/github/contributors/dacadeorg/celo-nft-minter.svg?style=for-the-badge

[contributors-url]: https://github.com/dacadeorg/celo-nft-minter/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/dacadeorg/celo-nft-minter.svg?style=for-the-badge

[forks-url]: https://github.com/dacadeorg/celo-nft-minter/network/members

[stars-shield]: https://img.shields.io/github/stars/dacadeorg/celo-nft-minter.svg?style=for-the-badge

[stars-url]: https://github.com/dacadeorg/celo-nft-minter/stargazers

[issues-shield]: https://img.shields.io/github/issues/dacadeorg/celo-nft-minter.svg?style=for-the-badge

[issues-url]: https://github.com/dacadeorg/celo-nft-minter/issues

[license-shield]: https://img.shields.io/github/license/dacadeorg/celo-nft-minter.svg?style=for-the-badge

[license-url]: ./README/LICENSE.txt

[product-screenshot]: ./README/images/shot1.png

[product-screenshot-2]: ./README/images/shot2.png
