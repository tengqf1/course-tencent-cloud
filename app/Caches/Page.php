<?php
/**
 * @copyright Copyright (c) 2021 深圳市酷瓜软件有限公司
 * @license https://opensource.org/licenses/GPL-2.0
 * @link https://www.koogua.com
 */

namespace App\Caches;

use App\Repos\Page as PageRepo;

class Page extends Cache
{

    protected $lifetime = 7 * 86400;

    public function getLifetime()
    {
        return $this->lifetime;
    }

    public function getKey($id = null)
    {
        return "page:{$id}";
    }

    public function getContent($id = null)
    {
        $pageRepo = new PageRepo();

        $page = $pageRepo->findById($id);

        return $page ?: null;
    }

}
