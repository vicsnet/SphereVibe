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


  // flag Post
  // to flag post you must have 15% credibility

  function flagPost(uint256 postId_) external {
    eaddress flagger = FHE.asEaddress(msg.sender);
    uint256 percent = (15 * totalCredibility) / 100;
    require(credibility[flagger] >= percent, "NOT_CREDIBLE");
    Post storage post = myPost[postId_];
    post.report = post.report + 1;
  }


  // withdrawTip
  function withdrawTip(uint256 amount_, address token_) external {
    uint256 balances = totalTips[msg.sender];
    require(amount_ <= balances, "Insufficient Tip");
    require(
      IERC20(token_).balanceOf(address(this)) > amount_,
      "TRY AGAIN LATER"
    );
    IERC20(token_).transferFrom(address(this), msg.sender, amount_);
    totalTips[msg.sender] -= amount_;
  }

  //   myTotalTip
  function myAllTips(
    Permission calldata perm,
    address tipped
  ) public view onlySender(perm) returns (uint256) {
    return totalTips[tipped];
  }

  // read single post
  function readSinglePost(
    Permission calldata perm,
    uint256 postId_
  )
    public
    view
    onlySender(perm)
    returns (string memory, uint256, uint256, euint256, eaddress)
  {
    string memory contents;
    Post memory post = myPost[postId_];
    if (post.flagged == true) {
      // contents = FHE.sealoutput(post.content, perm.publicKey);
      contents = "";
    } else {
      contents = post.content;
    }

    return (contents, post.likes, post.report, post.tips, post.creator);
  }

  // read all post

  function readAllPost(
    Permission calldata perm
  )
    external
    view
    onlySender(perm)
    returns (string[] memory, uint256[] memory, uint256[] memory)
  {
    uint256 len = ids.length;
    string[] memory contents = new string[](len);
    uint256[] memory likes = new uint256[](len);
    uint256[] memory reports = new uint256[](len);

    for (uint256 i = 0; i < len; i++) {
      Post storage post = myPost[i];
      if (post.flagged == true) {
        // contents[i] = FHE.sealoutput(post.content, perm.publicKey);
        contents[i] = "";
      } else {
        contents[i] = post.content;
      }
      likes[i] = post.likes;
      reports[i] = post.report;
    }

    return (contents, likes, reports);
  }

  // if post is flagged hash the content
  function flagPostStatus(uint256 postId_) external onlyOwner {
    Post storage post = myPost[postId_];
    post.flagged = true;
  }

  //   set total report post need
  function setTotalReport(uint256 totalReport_) public onlyOwner {
    totalReport = totalReport_;
  }

  
}
