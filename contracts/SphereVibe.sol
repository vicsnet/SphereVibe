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


 
  /**
  * @notice function to create post
  * @param _content the url of the content
  * @param _creator the Fhe encripted addresss of the creator
   */
  function createPost(string memory _content, eaddress _creator) external {
    uint256 id = postId++;
    Post memory post = myPost[id];
    post.content = _content;
    post.creator = _creator;
    ids.push(id);
    // emit event
  }


// tip post
/**
* @notice function to tip a particular post
* @param postId_ the id of the post to be tipped
* @param tipAmount_ the FHE encryted value of the amount 
* @param token_ the address of the token needed to be tipped 
*/ 
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


  /**
   * @notice function like post
   * @param postId_ the Id of the post to be liked 
  */
  function likePost(uint256 postId_) external {
    Post storage post = myPost[postId_];
    post.likes = post.likes + 1;
  }


/**
* @notice function flag Post
* @notice to flag post you must have 15% credibility
* @param postId_ Id of the post to be flagged 
 */
  function flagPost(uint256 postId_) external {
    eaddress flagger = FHE.asEaddress(msg.sender);
    uint256 percent = (15 * totalCredibility) / 100;
    require(credibility[flagger] >= percent, "NOT_CREDIBLE");
    Post storage post = myPost[postId_];
    post.report = post.report + 1;
  }


  /**
  * @notice function withdrawTip
  * @param amount to be withdrawn from the contract
  * @param token_ address of the token to be withdraw 

   */
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

/**
* @notice function myTotalTip
* @notice returns all tips in the contract
* @param Perm the public key parameters to use to unlock the content 
 */
  
  function myAllTips(
    Permission calldata perm,
    address tipped
  ) public view onlySender(perm) returns (uint256) {
    return totalTips[tipped];
  }

  /**
  *  @notice read single post
  * @notice returns the conntent of single post
  * @param Perm the public key parameters to use to unlock the content
  * @param postId_ id of the post to be viewed
  */ 
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

  /**
  *  @notice read all post
  * @notice returns the conntent of all post on the contract
  * @param Perm the public key parameters to use to unlock the content
  */ 

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

  /**
  *  @notice flag post status
  * @notice only contract owner can flag  post
  * @param postId_ id of the post to be flagged
  */ 
  function flagPostStatus(uint256 postId_) external onlyOwner {
    Post storage post = myPost[postId_];
    post.flagged = true;
  }

  /**
  *  @notice set total report needed to flag a post
  * @param totalReport the total report a content  needs to flag a post
  */ 
  function setTotalReport(uint256 totalReport_) public onlyOwner {
    totalReport = totalReport_;
  }

  
}
