<?php
declare(strict_types=1);

namespace BDM\BdmVhs\ViewHelpers\FrontendGroup;

use BDM\BdmFegm\Domain\Repository\FrontendUserGroupRepository;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ExtensionService;
use Closure;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3\CMS\Frontend\Resource\FileCollector;
use TYPO3\CMS\FrontendLogin\Service\UserService;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

/**
 * UriViewHelper
 */
class DomainObjectsFromIdListViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
{
    protected $escapeOutput = false;
    protected $escapeChildren = false;

    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('idList', 'string', '', true);
        $this->registerArgument('as', 'string', '', false);
    }

    public static function renderStatic(
        array                     $arguments,
        Closure                   $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    )
    {
        $connection = GeneralUtility::makeInstance(ConnectionPool::class)->getConnectionForTable('fe_groups');
        $queryBuilder = $connection->createQueryBuilder();
        $queryBuilder->getRestrictions()->removeAll();
        $queryBuilder->select('uid', 'title', 'description', 'tx_extbase_type')
            ->from('fe_groups')
            ->where(
                $queryBuilder->expr()->in(
                    'uid',
                    $queryBuilder->createNamedParameter(
                        GeneralUtility::intExplode(',', $arguments['idList'], true),
                        Connection::PARAM_INT_ARRAY
                    )
                )
            );
        $rows = $queryBuilder->execute()->fetchAll();
        $persistenceManager = GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager::class);
        $domainObjects = [];
        foreach($rows as $key => $row) {
            $txExtbaseType = $row['tx_extbase_type'];
            $object = $persistenceManager->getObjectByIdentifier($row['uid'], $txExtbaseType);
            $domainObjects[] = $object;
        }
        if(key_exists('as', $arguments) && $arguments['as'] !== null) {
            $renderingContext->getVariableProvider()->add($arguments['as'], $domainObjects);
            $output = $renderChildrenClosure();
            $renderingContext->getVariableProvider()->remove($arguments['as']);
            return $output;
        }else{
            return $domainObjects;
        }

    }
}
