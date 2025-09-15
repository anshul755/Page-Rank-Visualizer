package net.pagerankvisualizer.pageRankVisualizer.service;
import java.util.*;
import org.springframework.stereotype.Service;
import net.pagerankvisualizer.pageRankVisualizer.entity.PageRankVisualizerEntity;
import net.pagerankvisualizer.pageRankVisualizer.structure.Edge;

@Service
public class PageRankService {
    public Map<String,Double> calculatePageRank(PageRankVisualizerEntity graph,double dampingFactor,int maxIterations){
        List<String>vertices=graph.getVertices();
        List<Edge>edges=graph.getEdges();

        int n=vertices.size();

        Map<String,Double>ranks=new HashMap<>();
        Map<String,List<String>>adjacency=new HashMap<>();

        for(String v:vertices){
            ranks.put(v,1.0/n);
            adjacency.put(v,new ArrayList<>());
        }

        for(Edge e:edges){
            if(adjacency.containsKey(e.getFrom())){
                adjacency.get(e.getFrom()).add(e.getTo());
            }
        }

        for(int i=0;i<maxIterations;i++){
            Map<String,Double>newRanks=new HashMap<>();

            for(String v:vertices){
                newRanks.put(v,(1-dampingFactor)/n);
            }

            for(String v:vertices){
                List<String>outLinks=adjacency.get(v);
                if(outLinks!=null&&!outLinks.isEmpty()){
                    double share=ranks.get(v)/outLinks.size();

                    for(String target:outLinks){
                        newRanks.put(target,newRanks.get(target)+dampingFactor*share);
                    }

                }else{
                    double share=ranks.get(v)/n;

                    for(String target:vertices){
                        newRanks.put(target,newRanks.get(target)+dampingFactor*share);
                    }

                }
            }
            ranks=newRanks;
        }
        return ranks;
    }
}
