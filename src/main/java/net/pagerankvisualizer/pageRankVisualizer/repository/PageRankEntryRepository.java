package net.pagerankvisualizer.pageRankVisualizer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import net.pagerankvisualizer.pageRankVisualizer.entity.PageRankVisualizerEntity;
import org.bson.types.ObjectId;

public interface PageRankEntryRepository extends MongoRepository<PageRankVisualizerEntity,ObjectId>{

}