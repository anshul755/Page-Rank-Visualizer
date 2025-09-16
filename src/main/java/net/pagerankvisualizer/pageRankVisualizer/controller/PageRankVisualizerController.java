package net.pagerankvisualizer.pageRankVisualizer.controller;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import net.pagerankvisualizer.pageRankVisualizer.entity.PageRankVisualizerEntity;
import net.pagerankvisualizer.pageRankVisualizer.service.PageRankService;
import org.bson.types.ObjectId;

@RestController
@RequestMapping("/pagerank")
public class PageRankVisualizerController {
    
    @Autowired
    private PageRankService pageRankService;

    @PostMapping("/calculate")
    public String calculate(@RequestBody PageRankVisualizerEntity graph,  
                                        @RequestParam(defaultValue="0.85") double dampingFactor,
                                        @RequestParam(defaultValue="100") int maxIterations){
        ObjectId id=pageRankService.calculateAndSave(graph,dampingFactor,maxIterations);
        
        return id.toString();
    }

    @GetMapping("/history/{myId}")
    public Optional<PageRankVisualizerEntity> getById(@PathVariable ObjectId myId){
        return pageRankService.findById(myId);
    }

    @GetMapping("/history")
    public List<PageRankVisualizerEntity> getAll(){
        return pageRankService.getAll();
    }
}