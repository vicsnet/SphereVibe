// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {FHE, euint8, inEuint8, eaddress, euint256} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SphereVibe is Permissioned {
  address owner;
  // post storage struct to include likes tips creator address
  uint256 postId;
  // total report for post to be flagged
  uint256 totalReport;

  // Array to store all IDs
  uint256[] public ids;
  // user credibility

  uint256 totalCredibility;
  mapping(eaddress => uint256) credibility;

  //  total user tip in the contact
  mapping(address => uint256) private totalTips;
  // user
  // mapping of user to struct
  mapping(uint256 => Post) myPost;

  struct Post {
    string content;
    euint256 tips;
    uint256 likes;
    eaddress creator;
    uint256 report;
    bool flagged;
  }

  constructor() {
    owner = msg.sender;
  }
  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }
  // create post
  function createPost(string memory _content, eaddress _creator) external {
    uint256 id = postId++;
    Post memory post = myPost[id];
    post.content = _content;
    post.creator = _creator;
    ids.push(id);
    // emit event
  }
// tip post
  function tip(uint256 postId_, euint256 tipAmount_, address token_) external {
    Post storage post = myPost[postId_];
    address creator = FHE.decrypt(post.creator);
    uint256 transferAmount = FHE.decrypt(tipAmount_);
    uint tAmount = FHE.decrypt(post.tips) + transferAmount;
    euint256 totalAmount = FHE.asEuint256(tAmount);
    post.tips = totalAmount;
    totalTips[creator] += transferAmount;
    IERC20(token_).transfer(address(this), transferAmount);
    // IERC20(token_).transferFrom(msg.sender,address(this), transferAmount);
    // Emmit event
  }
  // like post
  function likePost(uint256 postId_) external {
    Post storage post = myPost[postId_];
    post.likes = post.likes + 1;
  }



  
}
