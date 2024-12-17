export const styles =`
  #select{
  --bblr: 0px;
  --bbrr: 0px;
  --btlr: 10px;
  --btrr: 10px;
    background: white;
    display: flex;
    align-items: center;
    border: 1px solid black;
    padding: 10px;
    box-sizing: border-box;
    border-radius: var(--btlr);
    outline: none;
    text-align: left;
    anchor-name: --items;
    position:relative;
    width: 300px;
    height: 40px;
  }
  #select:disabled{
    opacity:.6;
    pointer-events:none;
  }
#select #list a{
    padding: 5px;
    box-sizing: border-box;
  }
  #select #list{
    visibility:hidden;
    pointer-events:none;
    position:fixed;
    border-radius: 0px;
    background:white;
    overflow-y: auto;
    max-height:400px;
    box-shadow: 0px 20px 20px 4px #00000033;
    border: 1px solid black;
    border-top:none;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    top:calc(anchor(bottom));
    z-index:1000000;
    position-anchor: --items;
    left: anchor(left);
    right:anchor(right);
  }

  #select:focus-within{
    border-bottom-left-radius: var(--bblr);
    border-bottom-right-radius: var(--bbrr);
    border-bottom:none;
  }
  #select svg{
    max-width: 20px;
    width: 20px;
    height: 20px;;
    margin-left: auto;
  }
  #select:focus-within #list{
    visibility:visible;
    pointer-events:all;
    display:flex;
    flex-direction:column;
  }
  #select:focus-within #list a[part=item-selected]{
    background:blue;
    color: white;
  }`