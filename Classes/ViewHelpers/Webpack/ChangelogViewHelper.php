<?php
declare(strict_types = 1);
namespace BDM\BdmVhs\ViewHelpers\Webpack;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ExtensionService;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

/**
 * UriViewHelper
 */
class ChangelogViewHelper extends AbstractTagBasedViewHelper
{
    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('path', 'string', 'path to changelog.md', true);
    }

    /**
     */
    public function render(): string
    {
        // https://developpaper.com/update-the-version-number-using-the-npm-command-line/
        // https://www.npmjs.com/package/generate-changelog

        $path = $this->arguments["path"];
        $pathToChangelogMd = GeneralUtility::getFileAbsFileName($path);

//        $extensionRootFolder = GeneralUtility::getFileAbsFileName('EXT:bdm_drossschaffer_sitepackage/');
//        $pathToChangelogMd = $extensionRootFolder . 'Resources/Private/Webpack/MY_CUSTOM_CHANGELOG.md';
        $data = file_get_contents($pathToChangelogMd);
        $Parsedown = new \Parsedown();
        $html = $Parsedown->text($data);
        $html = '<div class="el-changelog"><div class="container">' . $html . '</div></div>';
        return $html;

    }
}
