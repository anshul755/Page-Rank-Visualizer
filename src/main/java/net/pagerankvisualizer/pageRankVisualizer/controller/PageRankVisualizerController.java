package net.pagerankvisualizer.pageRankVisualizer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.pagerankvisualizer.pageRankVisualizer.service.PageRankService;

@RestController
@RequestMapping("/pagerank")
public class PageRankVisualizerController {
    
    @Autowired
    private PageRankService pageRankService;


}
