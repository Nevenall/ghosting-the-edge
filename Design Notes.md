# General Design Notes

The built in markdown typography is OK but we need We need something more elaborate for things like ellipses and degree signs that sort of thing. 

Markdown-it typography does a good job of replacement actually. 

## Typographic Symbol Table

Symbol                 |  HTML     | Unreplaced (maybe)
-----------------------|-----------|------------
Hair space             | `&#8202;` | M.J. -> M.&#8202;J.
Thin space             | `&thinsp;`| M.J. -> M.&thinsp;J.
– En dash              | `&ndash;` | `-`       
— Em dash              | `&mdash;` | `--`       
− Minus                | `&minus;` |    
× Multiply             | `&times;` |        
÷ Divide               | `&divide;`|       
‘ Left single quote    | `&lsquo;` | '                 
’ Right single quote   | `&lsquo;` | '                 
“ Left double quote    | `&ldquo;` | "                 
” Right double quote   | `&rdquo;` | "                 
& Ampersand            | `&amp;`   | &      
… Ellipsis             | `&hellip;`|...
' Single prime         | `&prime;` |            
" Double prime         | `&Prime;` |            
° Degree               | `&deg;`   |   
· Middle dot           | `&middot;`|           
• Bullet               | `&bull;`  |     
© Copyright            | `&copy;`  |
® Registered trademark | `&reg;`   |
™ Trademark            | `&trade;` |

## fork and write would probably be way easier as an npm package. 

except for the tasks and problem matcher actions. 