from sqlmodel import Session

from app.repositories.node_repository import NodeRepository
from app.repositories.zone_repository import ZoneRepository
from app.models.node import Node
from app.models.zone import Zone
from app.schemas.node import NodeCreate, NodeUpdate
from app.schemas.zone import ZoneCreate


class NodeService:
    def __init__(self, session: Session):
        self.session = session
        self.node_repo = NodeRepository(session)
        self.zone_repo = ZoneRepository(session)


    def get_node(self, node_id: int) -> Node | None:
        node = self.node_repo.get(node_id)
        return node


    def list_nodes(self) -> list[Node] | None:
        pass


    def create_node(self, data: NodeCreate) -> Node:
        new_node = Node(
            name=data.name,
            location=data.location,
            hardware=data.hardware.model_dump(),
            irrigation_limits=data.irrigation_limits.model_dump(),
            automation=data.automation.model_dump(),
            batch_strategy=data.batch_strategy.model_dump(),
            logging=data.logging.model_dump()
        )

        self.node_repo.create(new_node)
        self.session.commit()

        return new_node


    def update_node(self, node_id: int, data: NodeUpdate) -> Node | None:
        pass


    def delete_node(self, node_id: int) -> bool:
        pass


    def add_zone_to_node(self, node_id: int, zone_data: ZoneCreate) -> Zone:
        node = self.node_repo.get(node_id)
        if not node:
            raise ValueError("Node {node_id} not found")
        
        new_zone = Zone(
            node_id=node_id,
            name=zone_data.name,
            relay_pin=zone_data.relay_pin,
            enabled=zone_data.enabled,
            irrigation_mode=zone_data.irrigation_mode,
            local_correction_factors=zone_data.local_correction_factors.model_dump(),
            frequency_settings=zone_data.frequency_settings.model_dump(),
            fallback_strategy=zone_data.fallback_strategy.model_dump(),
            irrigation_configuration=zone_data.irrigation_configuration.model_dump(),
            emitters_configuration=zone_data.emitters_configuration.model_dump()
        )

        self.zone_repo.create(new_zone)
        self.session.commit()
        

        return new_zone