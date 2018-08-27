* Table styles are screwed up since rebase. Looks like there were some changes made to use flex layout.
* re-evaluate TableConfiguration object. Name doesn't make sense right now, and some duplicated code for configuration handling in components.
* Test (see list of issues below)
* Push WIP PR

* [X] Rebase over refactor branch
* [X] Update new table type and test backward compatibility.
* [X] Delete old table
* [X] Remove column sizing rows on object removal (should be trivial since tracking by object ID already).
* [X] Look at optimizing styles in telemetry-table-row
   - Right now profiling does not highlight this as a bottleneck?
* [X] Add title to table cells
* [X] Add elipses for overflow on table cells
* [X] On entry, filter boxes need to remove magnifying glass.
* [X] auto-scroll
* [X] Show / hide columns (ie. table configuration)
* [X] Why aren't limits being applied until I scroll or do something?
* [X] Handle window resizing
* [X] Fix memory leaks
* [X] Remove isFromObject and hasColumn from TelemetryTableRow
* [X] Remove format caching
* [X] Add filtering
    * If the new filter string starts with the old filter string, filter based on the list of previously filtered results, not the base list.
    * Add the clear filter button
* [X] Cache formatted values for "just in time" formatting. I think cache on row. Opportunity to cache on column to benefit from multiple rows with the same value, but memory management becomes a problem then as cache could grow infinitely if the table is left to run.
* [X] Do some more testing with multiple objects. Not working properly right now.
* [X] Rows not being removed when object removed from composition
* [X] Subscribe to realtime data
* [X] Column widths should be done on receipt of FIRST DATA, not on receipt of historical data.
* [X] Filter subscription data
* [X] Export
* [X] Add loading spinner
* [X] in 'mounted', should not be necessary to bind to 'this'.
* [X] Stop Vue from decorating EVERYTHING (but especially the telemetry collection)
* [X] Need minimum width on tables. Provided by calcTableWidthPx in MCTTableController
* [X] Limits

* Benchmark - loading 1 million rows
    - Old tables: ~90s
    - New tables: ~11s
* 1 million rows in 11 secs vs 90s

To Test
* Test https://github.com/nasa/openmct/pull/2111
* Multiple instances of tables
* Make sure time columns are being correctly merged
* Test with MSL data sources
* Test with tutorial data sources
* Test backward compatibility with existing tables, esp. ones with column config.
* Behavior at different widths.
* Short tables
* Test with bounds / clock / time system changes.
* Memory leaks

Post WIP PR
* Move css to new table location
* Consider making telemetry-table-row component a single file component
* Fix jitter on auto-scroll
* Look at scroll-x again. Sounded like there might be some subtlety missing there (something to do with small columns?).
* Split TelemetryTableComponent into more components. It's too large now.
* Performance
    * Don't wrap row on load, do it on scroll.
    * On batch insert, check bounds once, rather than on each insert.
* See if sticky headers can be simplified (eg. can we combine headers table with content table?)
* Default sort behavior, and sticking to the bottom for realtime numerical
* Look at setting top on tbody, instead of each tr
* Replace all "mct-table" classes
* Consider making the sizing row a separate component. Encapsulate all sizing logic in there.
* consider making the header table a separate component.
* Test where no time column present (what will it sort by)

* [X] Optimization - don't both sorting filtered rows initially, just copy over values from bounded row collection which have already been sorted. 