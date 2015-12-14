## range for scope
### In Range - enque the card event

### Out of Range - dequeue the card event

## Controller for queue

### For all entries in queue
1. if new item is queued
 .. 1. start the timer
 .. 2. if the timer hits 10 - start that timer and pause all other timers
 .. 3. as timer hits 20 - extend the card

2. if a card is swiped away ..1. dequeue the card

for all within the near range

loop through and compare find the lowest rssi minor id
check if the minor id found is the one in the nearRange table
if so do nothing
else see if a boolean checking if a card is being read is true - if so do nothing
if a card isn't being read then flush the list and add the minor id as key. Start its timer

when it leaves the near range
its rssi should decrease relative to other nearby ones. Either case it is removed

when the timer hits 10 seconds 
create and serve the card
switch cardRead boolean to true

when a card is swiped away
stop and reset the timer
switch cardRead boolean to false

else add