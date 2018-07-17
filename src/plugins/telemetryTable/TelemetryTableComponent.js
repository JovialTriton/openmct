/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

 define([
    'vue',
    'text!./telemetry-table.html',
    './TelemetryTable'
],function (
    Vue, 
    TelemetryTableTemplate,
    TelemetryTable
) {
    const VISIBLE_ROW_COUNT = 100;
    const ROW_HEIGHT = 17;

    return function TelemetryTableComponent(domainObject, element, openmct) {
        let table = new TelemetryTable(domainObject, VISIBLE_ROW_COUNT, openmct);
        let processingScroll = false;

        return new Vue({
            el: element,
            template: TelemetryTableTemplate,
            data: function () {
                return {
                    headers: {},
                    headersCount: 0,
                    visibleRows: [],
                    columnWidths: {},
                    rowHeight: ROW_HEIGHT,
                    visibleRowsStart: 0,
                    visibleRowsEnd: 0,
                    totalHeight: 0,
                    visibleRowCount: VISIBLE_ROW_COUNT,
                    scrollable: undefined
                }
            },
            methods: {
                updateVisibleRows: function () {
                    let start = 0;
                    let end = this.visibleRowCount;
                    let filteredRows = table.filteredTelemetry.data();
                    let filteredTelemetryLength = filteredRows.length;
                    
                    this.totalHeight = this.rowHeight * filteredTelemetryLength - 1;
        
                    if (filteredTelemetryLength < this.visibleRowCount) {
                        end = filteredTelemetryLength;
                    } else {
                        let firstVisible = this.calculateFirstVisibleRow();
                        let lastVisible = this.calculateLastVisibleRow();
                        let totalVisible = lastVisible - firstVisible;

                        let numberOffscreen = this.visibleRowCount - totalVisible;
                        start = firstVisible - Math.floor(numberOffscreen / 2);
                        end = lastVisible + Math.ceil(numberOffscreen / 2);
        
                        if (start < 0) {
                            start = 0;
                            end = Math.min(VISIBLE_ROW_COUNT, filteredTelemetryLength);
                        } else if (end >= filteredTelemetryLength) {
                            end = filteredTelemetryLength;
                            start = end - VISIBLE_ROW_COUNT + 1;
                        }
                    }
                    this.visibleRows = filteredRows.slice(start, end);
                    this.visibleRows.forEach((row, rowIndex) => {
                        row.top = (rowIndex + start) * this.rowHeight + 'px';
                        row.width = 100 / this.headersCount + '%';
                    });
                    this.visibleRowsStart = start;
                    this.visibleRowsEnd = end;
                },
                calculateFirstVisibleRow: function () {
                    return Math.floor(this.scrollable.scrollTop / this.rowHeight);
                },
                calculateLastVisibleRow: function () {
                    let bottomScroll = this.scrollable.scrollTop + this.scrollable.offsetHeight;
                    return Math.floor(bottomScroll / this.rowHeight);
                },
                updateHeaders: function (headers) {
                    this.headers = headers;
                    this.headersCount = Object.values(headers).length;
                },
                updateSizingRow: function (sizingRow) {
                    let headerKeys = Object.keys(this.headers);
                    let columnWidth = 100 / headerKeys.length + '%';
                    this.columnWidths = headerKeys.map(header => columnWidth);
                    //Do I need to wait for re-render (RAF?) or 
                    //was that just the Angular digest?
                },
                sortBy: function (columnKey) {
                    table.sortByColumnKey(columnKey);
                },
                scroll: function() {
                    if (!processingScroll) {
                        processingScroll = true;
                        requestAnimationFrame(() => {
                            this.updateVisibleRows();
                            processingScroll = false;
                        });
                    }
                }

            },
            mounted: function () {
                table.on('updateHeaders', this.updateHeaders);

                table.filteredTelemetry.on('added', this.updateSizingRow, this);
                table.filteredTelemetry.on('added', this.updateVisibleRows, this);
                table.filteredTelemetry.on('removed', this.updateVisibleRows, this);
                table.filteredTelemetry.on('sorted', this.updateVisibleRows, this);

                this.scrollable = this.$el.querySelector('.t-scrolling');
            },
            destroyed: function () {
                table.off('updateHeaders', this.updateHeaders);

                table.filteredTelemetry.off('added', this.updateSizingRow, this);
                table.filteredTelemetry.off('added', this.updateVisibleRows, this);
                table.filteredTelemetry.off('removed', this.updateVisibleRows, this);
                table.filteredTelemetry.off('sorted', this.updateVisibleRows, this);
            }
        });
    }
 });